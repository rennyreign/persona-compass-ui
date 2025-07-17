-- First, add program_category column to personas table
ALTER TABLE public.personas ADD COLUMN program_category TEXT;

-- Insert sample personas for each organization
INSERT INTO public.personas (
  user_id, 
  organization_id, 
  name, 
  age_range, 
  occupation, 
  industry, 
  education_level, 
  income_range, 
  location, 
  personality_traits, 
  values, 
  goals, 
  pain_points, 
  preferred_channels, 
  description,
  program_category,
  avatar_url
) VALUES 
-- University of Florida personas
('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'uf'), 'Sarah Chen', '22-25', 'Recent Graduate', 'Technology', 'Bachelor''s Degree', '$40,000-$60,000', 'Gainesville, FL', ARRAY['Ambitious', 'Tech-savvy', 'Goal-oriented'], ARRAY['Innovation', 'Growth', 'Learning'], ARRAY['Career advancement', 'Skill development', 'Networking'], ARRAY['Limited experience', 'Job market competition', 'Student debt'], ARRAY['LinkedIn', 'Instagram', 'Email'], 'A driven recent graduate looking to break into the tech industry with a focus on continuous learning and professional development.', 'Computer Science', '/lovable-uploads/1a920559-d7a3-4c76-9bfc-7da61ccd715f.png'),

('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'uf'), 'Marcus Rodriguez', '25-30', 'Working Professional', 'Business', 'Bachelor''s Degree', '$50,000-$75,000', 'Tampa, FL', ARRAY['Analytical', 'Leadership-oriented', 'Strategic'], ARRAY['Excellence', 'Teamwork', 'Results'], ARRAY['Career progression', 'MBA education', 'Leadership skills'], ARRAY['Work-life balance', 'Career stagnation', 'Educational costs'], ARRAY['LinkedIn', 'Facebook', 'Email'], 'An ambitious professional seeking to advance their career through advanced business education and leadership development.', 'Business Administration', '/lovable-uploads/1b34ec87-603e-411a-ba2f-ddce2e6887e7.png'),

-- Arizona State University personas  
('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'asu'), 'Jessica Williams', '30-35', 'Healthcare Professional', 'Healthcare', 'Bachelor''s Degree', '$60,000-$80,000', 'Phoenix, AZ', ARRAY['Caring', 'Detail-oriented', 'Empathetic'], ARRAY['Health', 'Service', 'Excellence'], ARRAY['Advanced certification', 'Patient care improvement', 'Career growth'], ARRAY['Long hours', 'Continuing education requirements', 'Healthcare costs'], ARRAY['Facebook', 'Email', 'Professional networks'], 'A dedicated healthcare professional looking to advance their skills and provide better patient care through specialized education.', 'Healthcare Administration', '/lovable-uploads/20aa43f2-2351-4939-93db-0c4fac48c91a.png'),

('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'asu'), 'David Kim', '28-35', 'Engineer', 'Engineering', 'Master''s Degree', '$70,000-$90,000', 'Tempe, AZ', ARRAY['Logical', 'Problem-solver', 'Innovative'], ARRAY['Precision', 'Innovation', 'Quality'], ARRAY['Professional certification', 'Technical expertise', 'Project leadership'], ARRAY['Rapid technology changes', 'Certification costs', 'Time constraints'], ARRAY['LinkedIn', 'YouTube', 'Email'], 'An experienced engineer seeking to stay current with evolving technologies and advance into leadership roles.', 'Engineering', '/lovable-uploads/24dd0e2e-244c-4d6b-b857-11531bc70aba.png'),

-- Penn State personas
('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'psu'), 'Emily Johnson', '26-32', 'Marketing Manager', 'Marketing', 'Bachelor''s Degree', '$55,000-$75,000', 'State College, PA', ARRAY['Creative', 'Data-driven', 'Collaborative'], ARRAY['Creativity', 'Impact', 'Growth'], ARRAY['Digital marketing mastery', 'Team leadership', 'ROI improvement'], ARRAY['Budget constraints', 'Keeping up with trends', 'Measuring effectiveness'], ARRAY['Instagram', 'LinkedIn', 'Twitter'], 'A creative marketing professional looking to enhance digital marketing skills and advance into senior leadership positions.', 'Digital Marketing', '/lovable-uploads/30655c8c-b40b-4fd0-8a4a-3b300a0ffd0f.png'),

('11111111-1111-1111-1111-111111111111', (SELECT id FROM organizations WHERE subdomain = 'psu'), 'Robert Thompson', '35-45', 'Operations Manager', 'Manufacturing', 'Bachelor''s Degree', '$65,000-$85,000', 'Philadelphia, PA', ARRAY['Systematic', 'Efficiency-focused', 'Results-driven'], ARRAY['Efficiency', 'Quality', 'Reliability'], ARRAY['Process optimization', 'Team productivity', 'Cost reduction'], ARRAY['Resource limitations', 'Change resistance', 'Technology adoption'], ARRAY['Email', 'LinkedIn', 'Industry publications'], 'An experienced operations manager focused on improving efficiency and leading high-performing teams in manufacturing environments.', 'Operations Management', '/lovable-uploads/37f02383-ebc1-4ee9-b9b7-4d6004733a32.png');