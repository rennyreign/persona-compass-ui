-- Drop trigger and function with cascade, then recreate with proper search path
DROP TRIGGER IF EXISTS trigger_update_persona_performance ON campaign_performance CASCADE;
DROP FUNCTION IF EXISTS update_persona_performance_tracking() CASCADE;

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

-- Recreate trigger for campaign performance updates
CREATE TRIGGER trigger_update_persona_performance
  AFTER INSERT OR UPDATE ON campaign_performance
  FOR EACH ROW
  EXECUTE FUNCTION update_persona_performance_tracking();

-- Add missing unique constraint for persona performance tracking
ALTER TABLE persona_performance_tracking 
ADD CONSTRAINT unique_persona_date UNIQUE (persona_id, date);