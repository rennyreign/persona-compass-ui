-- Fix search path security warnings for our new functions
DROP FUNCTION IF EXISTS calculate_persona_effectiveness(UUID, DATE, DATE);
DROP FUNCTION IF EXISTS update_persona_performance_tracking();

-- Recreate function with proper search path
CREATE OR REPLACE FUNCTION calculate_persona_effectiveness(
  _persona_id UUID,
  _start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  _end_date DATE DEFAULT CURRENT_DATE
) RETURNS NUMERIC
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

-- Recreate trigger function with proper search path
CREATE OR REPLACE FUNCTION update_persona_performance_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  effectiveness NUMERIC;
  persona_uid UUID;
  persona_org_id UUID;
BEGIN
  -- Get persona details
  SELECT p.user_id, p.organization_id 
  INTO persona_uid, persona_org_id
  FROM personas p
  JOIN campaigns c ON c.persona_id = p.id
  WHERE c.id = NEW.campaign_id;
  
  -- Calculate effectiveness score for the persona
  SELECT calculate_persona_effectiveness(NEW.persona_id) INTO effectiveness;
  
  -- Insert or update daily tracking record
  INSERT INTO persona_performance_tracking (
    persona_id, user_id, organization_id, date, effectiveness_score
  ) VALUES (
    NEW.persona_id, persona_uid, persona_org_id, CURRENT_DATE, effectiveness
  )
  ON CONFLICT (persona_id, date) 
  DO UPDATE SET 
    effectiveness_score = effectiveness,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Fix missing unique constraint for persona performance tracking
ALTER TABLE persona_performance_tracking 
ADD CONSTRAINT unique_persona_date UNIQUE (persona_id, date);