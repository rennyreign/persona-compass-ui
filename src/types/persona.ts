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
  organization?: {
    id: string;
    name: string;
    subdomain: string | null;
  };
};

export type Organization = {
  id: string;
  name: string;
  subdomain: string | null;
};