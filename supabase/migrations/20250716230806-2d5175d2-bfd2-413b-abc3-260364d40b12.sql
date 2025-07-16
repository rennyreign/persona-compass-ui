-- Create organizations table for universities
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#253746',
  secondary_color TEXT DEFAULT '#3291d9',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table for permissions
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('bisk_admin', 'university_admin', 'university_user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Add organization_id to existing tables
ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.personas ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.campaigns ADD COLUMN organization_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE;
ALTER TABLE public.campaign_performance ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizations
CREATE POLICY "Bisk admins can view all organizations" 
ON public.organizations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'bisk_admin'
  )
);

CREATE POLICY "University users can view their organization" 
ON public.organizations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND organization_id = id
  )
);

CREATE POLICY "Bisk admins can manage all organizations" 
ON public.organizations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'bisk_admin'
  )
);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Bisk admins can manage all user roles" 
ON public.user_roles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'bisk_admin'
  )
);

CREATE POLICY "University admins can manage users in their organization" 
ON public.user_roles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'university_admin' 
    AND ur.organization_id = user_roles.organization_id
  )
);

-- Update RLS policies for existing tables to include organization isolation

-- Profiles: Users can see profiles in their organization + Bisk admins see all
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view profiles in their organization" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.user_roles ur1, public.user_roles ur2
    WHERE ur1.user_id = auth.uid() 
    AND ur2.user_id = profiles.user_id
    AND (
      ur1.role = 'bisk_admin' OR
      (ur1.organization_id = ur2.organization_id AND ur1.organization_id IS NOT NULL)
    )
  )
);

-- Personas: Organization-based access + Bisk admin override
DROP POLICY IF EXISTS "Users can view their own personas" ON public.personas;
CREATE POLICY "Users can view personas in their organization" 
ON public.personas FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND (
      role = 'bisk_admin' OR
      (organization_id = personas.organization_id AND organization_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can create personas in their organization" 
ON public.personas FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  (organization_id IS NULL OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND organization_id = personas.organization_id
  ))
);

-- Campaigns: Organization-based access + Bisk admin override
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
CREATE POLICY "Users can view campaigns in their organization" 
ON public.campaigns FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND (
      role = 'bisk_admin' OR
      (organization_id = campaigns.organization_id AND organization_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can create campaigns in their organization" 
ON public.campaigns FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  (organization_id IS NULL OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND organization_id = campaigns.organization_id
  ))
);

-- Campaign Performance: Organization-based access + Bisk admin override
DROP POLICY IF EXISTS "Users can view their own campaign performance" ON public.campaign_performance;
CREATE POLICY "Users can view campaign performance in their organization" 
ON public.campaign_performance FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND (
      role = 'bisk_admin' OR
      (organization_id = campaign_performance.organization_id AND organization_id IS NOT NULL)
    )
  )
);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get user's organization and role
CREATE OR REPLACE FUNCTION public.get_user_organization_role()
RETURNS TABLE(organization_id UUID, organization_name TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.organization_id,
    org.name as organization_name,
    ur.role
  FROM public.user_roles ur
  LEFT JOIN public.organizations org ON ur.organization_id = org.id
  WHERE ur.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_organization_id ON public.user_roles(organization_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_organizations_subdomain ON public.organizations(subdomain);
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_personas_organization_id ON public.personas(organization_id);
CREATE INDEX idx_campaigns_organization_id ON public.campaigns(organization_id);
CREATE INDEX idx_campaign_performance_organization_id ON public.campaign_performance(organization_id);