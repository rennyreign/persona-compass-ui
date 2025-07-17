-- Add active status column to personas table
ALTER TABLE public.personas 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Add index for better performance on status filtering
CREATE INDEX idx_personas_status ON public.personas(status);

-- Update existing personas to have 'active' status
UPDATE public.personas 
SET status = 'active' 
WHERE status IS NULL;