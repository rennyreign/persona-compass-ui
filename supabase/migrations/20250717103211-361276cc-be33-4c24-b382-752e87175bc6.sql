-- Create insights table
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  organization_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('optimization', 'opportunity', 'warning', 'trend')),
  is_gpt_generated BOOLEAN DEFAULT true,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view insights for personas they can view" 
ON public.insights 
FOR SELECT 
USING (public.can_view_persona(persona_id, auth.uid()));

CREATE POLICY "Users can create insights for personas they can view" 
ON public.insights 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  public.can_view_persona(persona_id, auth.uid())
);

CREATE POLICY "Users can update their own insights" 
ON public.insights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" 
ON public.insights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_insights_updated_at
BEFORE UPDATE ON public.insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add visual_identity_images column to personas table
ALTER TABLE public.personas 
ADD COLUMN visual_identity_images TEXT[];

-- Insert sample visual identity images for existing personas
UPDATE public.personas 
SET visual_identity_images = ARRAY[
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'
] 
WHERE visual_identity_images IS NULL;

-- Insert sample campaigns
INSERT INTO public.campaigns (
  id, user_id, persona_id, title, description, campaign_type, status, 
  budget, start_date, end_date, objectives, target_metrics, channels, 
  creative_assets, organization_id
) VALUES 
(
  gen_random_uuid(),
  (SELECT user_id FROM public.personas LIMIT 1),
  (SELECT id FROM public.personas LIMIT 1),
  'Social Media Engagement Campaign',
  'Increase brand awareness and engagement through targeted social media content',
  'brand_awareness',
  'active',
  15000.00,
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '60 days',
  ARRAY['Increase brand awareness', 'Drive website traffic', 'Generate leads'],
  ARRAY['CTR > 3%', 'CPC < $2.50', 'Conversion rate > 2%'],
  ARRAY['Facebook', 'Instagram', 'LinkedIn'],
  ARRAY['Video ads', 'Carousel posts', 'Story content'],
  (SELECT organization_id FROM public.personas LIMIT 1)
),
(
  gen_random_uuid(),
  (SELECT user_id FROM public.personas LIMIT 1),
  (SELECT id FROM public.personas LIMIT 1),
  'Google Ads Lead Generation',
  'Drive qualified leads through targeted Google Ads campaigns',
  'lead_generation',
  'active',
  8500.00,
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '45 days',
  ARRAY['Generate qualified leads', 'Improve conversion rate'],
  ARRAY['CPL < $45', 'Quality score > 7', 'Conversion rate > 3%'],
  ARRAY['Google Ads', 'Google Search', 'Display Network'],
  ARRAY['Search ads', 'Display banners', 'Landing pages'],
  (SELECT organization_id FROM public.personas LIMIT 1)
);

-- Insert sample campaign performance data
INSERT INTO public.campaign_performance (
  campaign_id, user_id, organization_id, date, impressions, clicks, 
  conversions, spend, ctr, cpc, cpm, conversion_rate, roas
)
SELECT 
  c.id as campaign_id,
  c.user_id,
  c.organization_id,
  CURRENT_DATE - (days || ' days')::INTERVAL as date,
  FLOOR(random() * 5000 + 1000) as impressions,
  FLOOR(random() * 150 + 20) as clicks,
  FLOOR(random() * 8 + 1) as conversions,
  ROUND((random() * 300 + 50)::numeric, 2) as spend,
  ROUND((random() * 2 + 1)::numeric, 2) as ctr,
  ROUND((random() * 3 + 1)::numeric, 2) as cpc,
  ROUND((random() * 10 + 5)::numeric, 2) as cpm,
  ROUND((random() * 3 + 1)::numeric, 2) as conversion_rate,
  ROUND((random() * 2 + 2)::numeric, 2) as roas
FROM public.campaigns c
CROSS JOIN generate_series(1, 30) as days
WHERE c.status = 'active';

-- Insert sample insights
INSERT INTO public.insights (
  persona_id, user_id, organization_id, title, content, type, is_gpt_generated
)
SELECT 
  p.id as persona_id,
  p.user_id,
  p.organization_id,
  insights.title,
  insights.content,
  insights.type,
  true
FROM public.personas p
CROSS JOIN (
  VALUES 
  ('Optimization Opportunity: Improve CTR', 'Based on recent campaign performance, your click-through rate could be improved by 25% by testing more compelling headlines and adjusting target demographics to focus on the 28-35 age group who show higher engagement rates.', 'optimization'),
  ('New Channel Opportunity: TikTok', 'Analysis shows that your target persona has high activity on TikTok during evening hours. Consider expanding your social media strategy to include short-form video content on this platform to reach untapped audiences.', 'opportunity'),
  ('Budget Allocation Warning', 'Current spend allocation shows 60% going to underperforming channels. Consider reallocating budget from Display ads to Google Search campaigns which show 40% better conversion rates for this persona.', 'warning'),
  ('Positive Trend: Mobile Engagement', 'Mobile engagement has increased by 45% over the past month. This trend suggests your mobile-optimized content strategy is working well. Consider increasing mobile-specific campaign budget.', 'trend'),
  ('Content Performance Insight', 'Educational content performs 3x better than promotional content for this persona. Focus on creating more how-to guides, industry insights, and thought leadership pieces to improve engagement.', 'optimization')
) as insights(title, content, type)
LIMIT 5;