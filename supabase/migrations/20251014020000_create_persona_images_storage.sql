-- Create storage bucket for persona images
INSERT INTO storage.buckets (id, name, public)
VALUES ('persona-images', 'persona-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read access to persona images
CREATE POLICY "Public Access to Persona Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'persona-images' );

-- Authenticated users can upload persona images
CREATE POLICY "Authenticated users can upload persona images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'persona-images' );

-- Service role can manage all persona images
CREATE POLICY "Service role can manage persona images"
ON storage.objects FOR ALL
TO service_role
USING ( bucket_id = 'persona-images' );

-- Allow authenticated users to update their uploads
CREATE POLICY "Users can update persona images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'persona-images' )
WITH CHECK ( bucket_id = 'persona-images' );

-- Allow authenticated users to delete persona images
CREATE POLICY "Users can delete persona images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'persona-images' );
