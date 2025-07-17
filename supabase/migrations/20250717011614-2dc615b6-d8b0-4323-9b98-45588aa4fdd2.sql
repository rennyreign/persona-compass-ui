-- Fix infinite recursion in personas RLS policies

-- Drop existing problematic policies for personas
DROP POLICY IF EXISTS "Users can view personas in their organization" ON public.personas;
DROP POLICY IF EXISTS "Users can create personas in their organization" ON public.personas;

-- Create security definer functions to check permissions without recursion
CREATE OR REPLACE FUNCTION public.can_view_persona(_persona_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- User can view if they own the persona
  SELECT EXISTS (
    SELECT 1 FROM public.personas 
    WHERE id = _persona_id AND user_id = _user_id
  )
  OR
  -- Or if they are bisk_admin
  public.check_user_role(_user_id, 'bisk_admin')
  OR
  -- Or if they are in the same organization as the persona
  EXISTS (
    SELECT 1 
    FROM public.personas p
    JOIN public.user_roles ur ON ur.organization_id = p.organization_id
    WHERE p.id = _persona_id 
      AND ur.user_id = _user_id 
      AND p.organization_id IS NOT NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_personas_in_org(_org_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- User can manage if they are bisk_admin
  SELECT public.check_user_role(_user_id, 'bisk_admin')
  OR
  -- Or if they are in the organization (when org_id is not null)
  (
    _org_id IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = _user_id AND organization_id = _org_id
    )
  )
  OR
  -- Or if org_id is null (personal personas)
  _org_id IS NULL;
$$;

-- Create new non-recursive policies for personas
CREATE POLICY "Users can view personas they have access to"
ON public.personas
FOR SELECT
TO authenticated
USING (public.can_view_persona(id, auth.uid()));

CREATE POLICY "Users can create their own personas"
ON public.personas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create personas in their organization"
ON public.personas
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  public.can_manage_personas_in_org(organization_id, auth.uid())
);

CREATE POLICY "Users can update their own personas"
ON public.personas
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personas"
ON public.personas
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Also fix campaign policies to use security definer functions
DROP POLICY IF EXISTS "Users can view campaigns in their organization" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns in their organization" ON public.campaigns;

CREATE POLICY "Users can view campaigns they have access to"
ON public.campaigns
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR 
  public.check_user_role(auth.uid(), 'bisk_admin') OR
  (
    organization_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND organization_id = campaigns.organization_id
    )
  )
);

CREATE POLICY "Users can create campaigns in their organization"
ON public.campaigns
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  public.can_manage_personas_in_org(organization_id, auth.uid())
);