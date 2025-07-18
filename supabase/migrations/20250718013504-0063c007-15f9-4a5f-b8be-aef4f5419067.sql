-- Create some sample campaigns linked to existing personas
INSERT INTO public.campaigns (user_id, persona_id, title, description, campaign_type, status, budget, start_date, end_date, objectives, target_metrics, channels, creative_assets, organization_id)
SELECT 
  p.user_id,
  p.id as persona_id,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN 'Digital Marketing Campaign for ' || p.name
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN 'Social Media Outreach - ' || p.name
    ELSE 'Brand Awareness Campaign - ' || p.name
  END as title,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN 'Comprehensive digital marketing campaign targeting ' || p.name || ' demographic with focus on ' || COALESCE(p.program_category, 'general programs')
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN 'Social media focused campaign to engage ' || p.name || ' through targeted content and community building'
    ELSE 'Brand awareness initiative designed to increase visibility among ' || p.name || ' audience segment'
  END as description,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN 'digital'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN 'social'
    ELSE 'awareness'
  END as campaign_type,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN 'active'
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN 'paused'
    ELSE 'draft'
  END as status,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN 15000
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN 8500
    ELSE 12000
  END as budget,
  CURRENT_DATE - INTERVAL '30 days' + (ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) * INTERVAL '10 days') as start_date,
  CURRENT_DATE + INTERVAL '60 days' + (ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) * INTERVAL '10 days') as end_date,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN ARRAY['Increase brand awareness', 'Generate leads', 'Drive enrollment']
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN ARRAY['Build community engagement', 'Increase social media following', 'Drive website traffic']
    ELSE ARRAY['Enhance brand visibility', 'Educate target audience', 'Build brand trust']
  END as objectives,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN ARRAY['CTR', 'Conversion Rate', 'CPA', 'ROAS']
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN ARRAY['Engagement Rate', 'Reach', 'Impressions', 'Follower Growth']
    ELSE ARRAY['Brand Awareness', 'Reach', 'Impressions', 'Website Traffic']
  END as target_metrics,
  CASE 
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 1 THEN ARRAY['Google Ads', 'Facebook', 'LinkedIn']
    WHEN ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at) = 2 THEN ARRAY['Instagram', 'TikTok', 'Facebook']
    ELSE ARRAY['YouTube', 'Google Display', 'LinkedIn']
  END as channels,
  ARRAY['Banner ads', 'Video content', 'Social media posts'] as creative_assets,
  p.organization_id
FROM public.personas p
WHERE p.status = 'active'
LIMIT 10;