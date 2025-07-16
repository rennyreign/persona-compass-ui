-- Insert mock personas into the database
-- First, get organization IDs for reference
WITH org_lookup AS (
  SELECT 
    'strostafzewfkycctzes'::uuid as bisk_org_id,
    (SELECT id FROM organizations WHERE name = 'Arizona State University' LIMIT 1) as asu_org_id,
    (SELECT id FROM organizations WHERE name = 'University of Florida' LIMIT 1) as uf_org_id
)

INSERT INTO personas (
  id, user_id, organization_id, name, age_range, occupation, industry, 
  education_level, income_range, location, personality_traits, values, 
  goals, pain_points, preferred_channels, avatar_url, description
) 
SELECT * FROM (
  VALUES
    -- Justin - Business Administration (ASU)
    (
      '6'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT asu_org_id FROM org_lookup),
      'Justin',
      '28-35',
      'Mid-Career Professional',
      'Business Administration',
      'Bachelor''s in Business/Finance',
      '$95K-140K',
      'Metro Detroit area',
      ARRAY['Excellence', 'Strategic thinking', 'Team success', 'Business strategy', 'Leadership development', 'Executive coaching', 'Golf'],
      ARRAY['Excellence', 'Strategic thinking', 'Team success'],
      ARRAY['C-suite advancement', 'MBA completion', 'Build executive network'],
      ARRAY['Being passed over for promotion', 'Industry disruption', 'Work-life balance challenges'],
      ARRAY['LinkedIn', 'Email', 'Harvard Business Review', 'Industry conferences', 'Podcasts'],
      '/lovable-uploads/ef28c6de-2741-4c99-99f4-b0a87bb954f8.png',
      'Strategic thinking meets operational excellence

Lifestyle: Professional, goal-driven, relationship-focused

Motivations: Leadership responsibility, Financial success, Team development

Program Needs: Executive MBA curriculum, Strategic leadership training, Financial analysis mastery, Change management skills, Executive networking access, Industry case study analysis'
    ),
    -- Liz - Healthcare (University of Florida)
    (
      '2'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT uf_org_id FROM org_lookup),
      'Liz',
      '25-34',
      'Early Stage Career',
      'Healthcare',
      'Bachelor''s + work experience',
      '$75K-120K',
      'Metro Detroit area',
      ARRAY['Achievement', 'Stability', 'Growth', 'Leadership books', 'Networking events', 'Golf', 'Investment'],
      ARRAY['Achievement', 'Stability', 'Growth'],
      ARRAY['Executive role transition', 'Network with industry leaders', 'Develop strategic thinking'],
      ARRAY['Career stagnation', 'Age discrimination', 'Financial instability during transition'],
      ARRAY['LinkedIn', 'Facebook', 'Email', 'Professional networks', 'Podcasts'],
      '/lovable-uploads/a3668f73-99ce-4727-ae09-712fc0960627.png',
      'Transforming experience into leadership excellence

Lifestyle: Time-conscious, goal-oriented

Motivations: Leadership impact, Financial growth, Work-life balance

Program Needs: Executive leadership training, Strategic thinking modules, Network access to C-suite, Flexible scheduling options, ROI measurement tools, Industry transformation insights'
    ),
    -- Claire - Management Strategy & Leadership (ASU)
    (
      '3'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT asu_org_id FROM org_lookup),
      'Claire',
      '45-55',
      'Mid-Career Professional',
      'Management Strategy & Leadership',
      'Bachelor''s degree',
      '$50K-85K',
      'Small towns/Rural Michigan',
      ARRAY['Learning', 'Tradition', 'Community', 'Reading', 'Community involvement', 'Family activities', 'Travel'],
      ARRAY['Learning', 'Tradition', 'Community'],
      ARRAY['Skill diversification', 'Professional certification', 'Personal enrichment'],
      ARRAY['Technology gaps', 'Ageism in workplace', 'Irrelevance in changing markets'],
      ARRAY['Facebook', 'Email', 'YouTube', 'Professional associations', 'Traditional media'],
      '/lovable-uploads/b7e3b24b-6f59-43f4-b77d-3945014207ee.png',
      'It''s never too late to learn something new

Lifestyle: Balanced, community-focused

Motivations: Intellectual curiosity, Job security, Personal fulfillment

Program Needs: Self-paced learning options, Practical skill applications, Community support network, Cost-effective programs, Work-life balance consideration, Clear progression pathways'
    ),
    -- Matthew - Supply Chain (University of Florida)
    (
      '1'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT uf_org_id FROM org_lookup),
      'Matthew',
      '34-45',
      'Mid-Career Professional',
      'Supply Chain',
      'Current undergrad',
      '$0-25K (family support)',
      'Urban/Suburban Michigan',
      ARRAY['Innovation', 'Efficiency', 'Authenticity', 'Coding', 'Gaming', 'Entrepreneurship', 'Tech podcasts'],
      ARRAY['Innovation', 'Efficiency', 'Authenticity'],
      ARRAY['Land FAANG internship', 'Master full-stack development', 'Build startup portfolio'],
      ARRAY['Falling behind in rapidly evolving tech', 'Impostor syndrome', 'Job market saturation'],
      ARRAY['Instagram', 'TikTok', 'LinkedIn', 'Discord', 'YouTube'],
      '/lovable-uploads/d84fb05f-879d-4d53-9840-0637944579b1.png',
      'Building tomorrow''s tech solutions today

Lifestyle: Digital-first, highly connected

Motivations: Innovation and creativity, High earning potential, Making global impact

Program Needs: Async learning flexibility, Industry-relevant projects, Personal brand credibility, Tech stack diversity, Networking opportunities, Career placement support'
    ),
    -- Kelly - Supply Chain (ASU)
    (
      '4'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT asu_org_id FROM org_lookup),
      'Kelly',
      '50-60',
      'Senior Executive',
      'Supply Chain',
      'Advanced degree + extensive experience',
      '$200K+',
      'Major metropolitan areas',
      ARRAY['Excellence', 'Integrity', 'Innovation', 'Strategic planning', 'Mentoring', 'Industry analysis', 'Executive coaching'],
      ARRAY['Excellence', 'Integrity', 'Innovation'],
      ARRAY['C-suite advancement', 'Board position preparation', 'Legacy building'],
      ARRAY['Industry disruption', 'Succession planning', 'Market volatility'],
      ARRAY['LinkedIn', 'Email', 'Industry publications', 'Executive networks', 'Conferences'],
      '/lovable-uploads/4341c6c4-9c16-40ac-891a-84356888cd98.png',
      'Leading with wisdom and vision

Lifestyle: High-performance, results-driven

Motivations: Thought leadership, Industry influence, Organizational impact

Program Needs: Executive-level curriculum, Peer networking opportunities, Industry transformation insights, Leadership coaching, Strategic decision-making frameworks, Board readiness preparation'
    ),
    -- Ravi - Data Analytics (University of Florida)
    (
      '5'::uuid,
      '2f213a0d-58f9-4365-8275-181a0f38d851'::uuid,
      (SELECT uf_org_id FROM org_lookup),
      'Ravi',
      '28-32',
      'Early-Mid Career Professional',
      'Data Analytics',
      'Bachelor''s in Engineering/Math',
      '$85K-115K',
      'Metro Detroit area',
      ARRAY['Innovation', 'Analytical thinking', 'Continuous learning', 'Machine learning', 'Data visualization', 'Tech conferences', 'Open source projects'],
      ARRAY['Innovation', 'Analytical thinking', 'Continuous learning'],
      ARRAY['Master advanced analytics', 'Lead data science teams', 'Drive business impact through insights'],
      ARRAY['Technology obsolescence', 'Career plateau', 'Imposter syndrome in leadership'],
      ARRAY['LinkedIn', 'GitHub', 'Reddit', 'Medium', 'YouTube'],
      '/lovable-uploads/7bf9f918-7338-4cd7-aadd-277d74ae073e.png',
      'Data-driven decisions for business success

Lifestyle: Tech-savvy, career-focused

Motivations: Problem-solving impact, Career advancement, Technical mastery

Program Needs: Advanced statistical methods, Business intelligence tools, Leadership development, Industry case studies, Networking with data professionals, Hands-on project experience'
    )
) AS v(id, user_id, organization_id, name, age_range, occupation, industry, education_level, income_range, location, personality_traits, values, goals, pain_points, preferred_channels, avatar_url, description);