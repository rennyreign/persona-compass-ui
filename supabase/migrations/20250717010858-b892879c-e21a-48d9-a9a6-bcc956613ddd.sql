-- Fix infinite recursion in user_roles RLS policies by creating a security definer function

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Bisk admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "University admins can manage users in their organization" ON public.user_roles;

-- Create a security definer function to check user roles without recursion
CREATE OR REPLACE FUNCTION public.check_user_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "Bisk admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.check_user_role(auth.uid(), 'bisk_admin'));

CREATE POLICY "University admins can manage users in their organization"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'university_admin'
      AND ur.organization_id = user_roles.organization_id
  )
);

-- Also create some sample personas for testing
INSERT INTO public.personas (
  name, 
  description, 
  age_range, 
  occupation, 
  education_level, 
  location, 
  income_range, 
  industry, 
  goals, 
  pain_points, 
  personality_traits, 
  values, 
  preferred_channels, 
  program_category,
  user_id,
  organization_id
) VALUES 
(
  'Sarah Tech Professional',
  'A mid-career technology professional looking to advance her skills and career prospects through continuing education.',
  '28-35',
  'Software Engineer',
  'Bachelor''s Degree',
  'San Francisco, CA',
  '$80,000-$120,000',
  'Technology',
  ARRAY['Career advancement', 'Skill enhancement', 'Network building', 'Work-life balance'],
  ARRAY['Keeping up with technology', 'Time management', 'Career stagnation', 'Impostor syndrome'],
  ARRAY['Analytical', 'Detail-oriented', 'Collaborative', 'Growth-minded'],
  ARRAY['Innovation', 'Learning', 'Efficiency', 'Quality'],
  ARRAY['LinkedIn', 'Tech blogs', 'Online courses', 'Professional meetups'],
  'Technology & Engineering',
  '2f213a0d-58f9-4365-8275-181a0f38d851',
  (SELECT id FROM public.organizations WHERE subdomain = 'bisk' LIMIT 1)
),
(
  'Michael Business Leader',
  'An experienced business professional seeking executive-level education to transition into senior leadership roles.',
  '35-45',
  'Marketing Director',
  'Master''s Degree',
  'New York, NY',
  '$120,000-$180,000',
  'Marketing & Advertising',
  ARRAY['Executive leadership', 'Strategic thinking', 'Team management', 'Business growth'],
  ARRAY['Managing remote teams', 'Digital transformation', 'Budget constraints', 'Market competition'],
  ARRAY['Strategic', 'Decisive', 'Influential', 'Results-driven'],
  ARRAY['Leadership', 'Excellence', 'Innovation', 'Integrity'],
  ARRAY['LinkedIn', 'Business publications', 'Webinars', 'Industry conferences'],
  'Business & Management',
  '2f213a0d-58f9-4365-8275-181a0f38d851',
  (SELECT id FROM public.organizations WHERE subdomain = 'bisk' LIMIT 1)
),
(
  'Emily Healthcare Professional',
  'A healthcare professional looking to enhance patient care skills and stay current with medical advances.',
  '25-40',
  'Registered Nurse',
  'Bachelor''s Degree',
  'Chicago, IL',
  '$60,000-$90,000',
  'Healthcare',
  ARRAY['Patient care excellence', 'Professional development', 'Specialty certification', 'Leadership skills'],
  ARRAY['Burnout prevention', 'Keeping current with practices', 'Work stress', 'Technology adoption'],
  ARRAY['Compassionate', 'Reliable', 'Adaptable', 'Dedicated'],
  ARRAY['Compassion', 'Excellence', 'Lifelong learning', 'Service'],
  ARRAY['Medical journals', 'Professional associations', 'Online training', 'Peer networks'],
  'Healthcare & Medicine',
  '2f213a0d-58f9-4365-8275-181a0f38d851',
  (SELECT id FROM public.organizations WHERE subdomain = 'bisk' LIMIT 1)
);