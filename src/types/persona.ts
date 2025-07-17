export type Persona = {
  id: string;
  name: string;
  age_range: string | null;
  occupation: string | null;
  industry: string | null;
  education_level: string | null;
  income_range: string | null;
  location: string | null;
  personality_traits: string[] | null;
  values: string[] | null;
  goals: string[] | null;
  pain_points: string[] | null;
  preferred_channels: string[] | null;
  description: string | null;
  program_category: string | null;
  avatar_url: string | null;
  status: string;
  organization_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  visual_identity_images?: string[] | null;
  organization?: {
    id: string;
    name: string;
    subdomain: string | null;
  };
};

export type Campaign = {
  id: string;
  user_id: string;
  persona_id: string;
  title: string;
  description: string | null;
  campaign_type: string | null;
  status: string;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  objectives: string[] | null;
  target_metrics: string[] | null;
  channels: string[] | null;
  creative_assets: string[] | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  persona_id: string;
  user_id: string;
  organization_id: string | null;
  title: string;
  content: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'trend';
  is_gpt_generated: boolean;
  generated_at: string;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  name: string;
  subdomain: string | null;
};