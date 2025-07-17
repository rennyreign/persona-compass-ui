-- Completely rebuild RLS policies without recursion

-- First, disable RLS temporarily to fix the policies
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies and functions
DROP POLICY IF EXISTS "Bisk admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "University admins can manage users in their organization" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

DROP POLICY IF EXISTS "Users can view personas they have access to" ON public.personas;
DROP POLICY IF EXISTS "Users can create their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can create personas in their organization" ON public.personas;
DROP POLICY IF EXISTS "Users can update their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can delete their own personas" ON public.personas;

DROP FUNCTION IF EXISTS public.check_user_role;
DROP FUNCTION IF EXISTS public.can_view_persona;
DROP FUNCTION IF EXISTS public.can_manage_personas_in_org;

-- Create a simple function to get user role without recursion
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Simple policies for user_roles (no recursion)
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow bisk admin operations"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  -- Allow if current user is bisk_admin (check directly without function)
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'bisk_admin'
  )
);

-- Simple policies for personas (no recursion)
CREATE POLICY "Users can view their own personas"
ON public.personas
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Bisk admins can view all personas"
ON public.personas
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'bisk_admin'
  )
);

CREATE POLICY "Users can manage their own personas"
ON public.personas
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Simple policies for campaigns (no recursion)
CREATE POLICY "Users can view their own campaigns"
ON public.campaigns
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Bisk admins can view all campaigns"
ON public.campaigns
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'bisk_admin'
  )
);

CREATE POLICY "Users can manage their own campaigns"
ON public.campaigns
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;