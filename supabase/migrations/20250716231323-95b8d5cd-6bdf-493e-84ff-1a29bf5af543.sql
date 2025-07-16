-- Insert sample organizations for testing
INSERT INTO public.organizations (name, domain, subdomain, primary_color, secondary_color, settings) VALUES
('Bisk Education', 'bisk.edu', 'bisk', '#253746', '#3291d9', '{"is_master": true}'),
('Arizona State University', 'asu.edu', 'asu', '#8C1D40', '#FFC627', '{}'),
('University of Florida', 'ufl.edu', 'ufl', '#0021A5', '#FA4616', '{}');

-- Note: Cannot directly insert into auth.users as it's managed by Supabase Auth
-- The dummy admin user needs to be created through the auth signup process
-- However, we can prepare the user_roles for when the user signs up

-- Create a function to assign admin role to the first user who signs up with admin@bisk.com
CREATE OR REPLACE FUNCTION public.handle_admin_user()
RETURNS TRIGGER AS $$
DECLARE
  bisk_org_id UUID;
BEGIN
  -- Get Bisk organization ID
  SELECT id INTO bisk_org_id FROM public.organizations WHERE subdomain = 'bisk' LIMIT 1;
  
  -- If this is the admin@bisk.com user, make them a bisk_admin
  IF NEW.email = 'admin@bisk.com' THEN
    INSERT INTO public.user_roles (user_id, organization_id, role)
    VALUES (NEW.id, bisk_org_id, 'bisk_admin');
    
    -- Update their profile with organization
    UPDATE public.profiles 
    SET organization_id = bisk_org_id 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign admin role
CREATE TRIGGER on_auth_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_user();