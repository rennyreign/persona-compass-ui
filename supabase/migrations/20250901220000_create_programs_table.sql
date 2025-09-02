-- Create programs table for managing university programs
CREATE TABLE IF NOT EXISTS programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    target_audience TEXT,
    key_benefits TEXT[] DEFAULT '{}',
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_organization_id ON programs(organization_id);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_name ON programs(name);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view programs for their organization" ON programs
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM user_roles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Bisk admins can manage all programs" ON programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'bisk_admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_programs_updated_at 
    BEFORE UPDATE ON programs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample MSU programs from existing data
INSERT INTO programs (name, category, description, target_audience, key_benefits, organization_id)
SELECT 
    'Supply Chain Management Certificate',
    'Supply Chain Management',
    'Advanced supply chain strategy, analytics, and operations management for experienced professionals',
    'Operations managers, procurement specialists, logistics coordinators, supply chain analysts',
    ARRAY[
        'Strategic supply chain thinking',
        'Advanced analytics and forecasting', 
        'Risk management and resilience',
        'Sustainability and ESG integration',
        'Digital transformation strategies'
    ],
    id
FROM organizations 
WHERE name = 'Michigan State University'
ON CONFLICT DO NOTHING;

INSERT INTO programs (name, category, description, target_audience, key_benefits, organization_id)
SELECT 
    'Management and Leadership Certificate',
    'Management and Leadership',
    'Executive leadership development for emerging and established managers',
    'Team leaders, project managers, department supervisors, emerging leaders',
    ARRAY[
        'Strategic leadership skills',
        'Team management and development',
        'Change management expertise', 
        'Organizational effectiveness',
        'Executive presence and communication'
    ],
    id
FROM organizations 
WHERE name = 'Michigan State University'
ON CONFLICT DO NOTHING;

INSERT INTO programs (name, category, description, target_audience, key_benefits, organization_id)
SELECT 
    'Human Capital Management Certificate',
    'Human Capital Management', 
    'Strategic HR management and talent development for HR professionals',
    'HR generalists, training coordinators, benefits administrators, talent acquisition specialists',
    ARRAY[
        'Strategic HR planning',
        'Talent development and retention',
        'Performance management systems',
        'Compensation and benefits strategy', 
        'Employment law and compliance'
    ],
    id
FROM organizations 
WHERE name = 'Michigan State University'
ON CONFLICT DO NOTHING;
