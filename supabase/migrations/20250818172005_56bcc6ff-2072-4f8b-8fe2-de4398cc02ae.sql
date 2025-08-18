-- Add enhanced campaign attribution fields
ALTER TABLE campaigns 
ADD COLUMN persona_traits_tested TEXT[],
ADD COLUMN messaging_variant TEXT,
ADD COLUMN expected_cpl NUMERIC,
ADD COLUMN expected_ctr NUMERIC,
ADD COLUMN attribution_score NUMERIC DEFAULT 0;

-- Add persona performance tracking table
CREATE TABLE persona_performance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  persona_id UUID NOT NULL,
  user_id UUID NOT NULL,
  organization_id UUID,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  effectiveness_score NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  cost_efficiency NUMERIC DEFAULT 0,
  roi_score NUMERIC DEFAULT 0,
  campaign_count INTEGER DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  avg_cpl NUMERIC DEFAULT 0,
  avg_ctr NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on persona performance tracking
ALTER TABLE persona_performance_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for persona performance tracking
CREATE POLICY "Users can view performance tracking for personas they can view" 
ON persona_performance_tracking 
FOR SELECT 
USING (can_view_persona(persona_id, auth.uid()));

CREATE POLICY "Users can create performance tracking for personas they can view" 
ON persona_performance_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND can_view_persona(persona_id, auth.uid()));

CREATE POLICY "Users can update their own performance tracking" 
ON persona_performance_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create A/B testing experiments table
CREATE TABLE ab_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  persona_id UUID NOT NULL,
  user_id UUID NOT NULL,
  organization_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  variant_a_description TEXT NOT NULL,
  variant_b_description TEXT NOT NULL,
  test_metric TEXT NOT NULL, -- 'cpl', 'ctr', 'conversion_rate', etc.
  status TEXT DEFAULT 'draft', -- draft, running, completed, paused
  start_date DATE,
  end_date DATE,
  sample_size_target INTEGER,
  confidence_level NUMERIC DEFAULT 0.95,
  statistical_significance BOOLEAN DEFAULT false,
  winner_variant TEXT, -- 'a', 'b', or 'inconclusive'
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on A/B experiments
ALTER TABLE ab_experiments ENABLE ROW LEVEL SECURITY;

-- Create policies for A/B experiments
CREATE POLICY "Users can view experiments for personas they can view" 
ON ab_experiments 
FOR SELECT 
USING (can_view_persona(persona_id, auth.uid()));

CREATE POLICY "Users can create experiments for personas they can view" 
ON ab_experiments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND can_view_persona(persona_id, auth.uid()));

CREATE POLICY "Users can update their own experiments" 
ON ab_experiments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiments" 
ON ab_experiments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add experiment tracking to campaigns
ALTER TABLE campaigns 
ADD COLUMN experiment_id UUID,
ADD COLUMN experiment_variant TEXT; -- 'a' or 'b'

-- Create function to calculate persona effectiveness score
CREATE OR REPLACE FUNCTION calculate_persona_effectiveness(
  _persona_id UUID,
  _start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  _end_date DATE DEFAULT CURRENT_DATE
) RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  avg_cpl NUMERIC := 0;
  avg_ctr NUMERIC := 0;
  conversion_rate NUMERIC := 0;
  campaign_count INTEGER := 0;
  roi_score NUMERIC := 0;
  effectiveness_score NUMERIC := 0;
BEGIN
  -- Calculate metrics from campaign performance
  SELECT 
    COALESCE(AVG(cp.spend::NUMERIC / NULLIF(cp.conversions, 0)), 0),
    COALESCE(AVG(cp.ctr), 0),
    COALESCE(AVG(cp.conversion_rate), 0),
    COUNT(DISTINCT c.id)
  INTO avg_cpl, avg_ctr, conversion_rate, campaign_count
  FROM campaigns c
  JOIN campaign_performance cp ON c.id = cp.campaign_id
  WHERE c.persona_id = _persona_id
    AND cp.date BETWEEN _start_date AND _end_date;
  
  -- Calculate effectiveness score (0-100 scale)
  -- Lower CPL = better (inverse relationship)
  -- Higher CTR = better
  -- Higher conversion rate = better
  -- More campaigns = more data reliability
  
  IF campaign_count > 0 THEN
    roi_score := CASE 
      WHEN avg_cpl > 0 THEN (100 / avg_cpl) * avg_ctr * conversion_rate
      ELSE avg_ctr * conversion_rate * 10
    END;
    
    effectiveness_score := LEAST(100, roi_score * (1 + (campaign_count::NUMERIC / 10)));
  END IF;
  
  RETURN COALESCE(effectiveness_score, 0);
END;
$$;

-- Create trigger to update persona performance tracking
CREATE OR REPLACE FUNCTION update_persona_performance_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  effectiveness NUMERIC;
BEGIN
  -- Calculate effectiveness score for the persona
  SELECT calculate_persona_effectiveness(NEW.persona_id) INTO effectiveness;
  
  -- Insert or update daily tracking record
  INSERT INTO persona_performance_tracking (
    persona_id, user_id, organization_id, date, effectiveness_score
  ) VALUES (
    NEW.persona_id, NEW.user_id, NEW.organization_id, CURRENT_DATE, effectiveness
  )
  ON CONFLICT (persona_id, date) 
  DO UPDATE SET 
    effectiveness_score = effectiveness,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Create trigger for campaign performance updates
CREATE TRIGGER trigger_update_persona_performance
  AFTER INSERT OR UPDATE ON campaign_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_persona_performance_tracking();