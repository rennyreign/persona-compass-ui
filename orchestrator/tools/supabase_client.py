import os
import json
import uuid
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from pathlib import Path

class SupabaseIntegration:
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client with environment variables"""
        try:
            # Try to load from .env file in project root
            env_file = Path(__file__).parent.parent.parent / ".env"
            if env_file.exists():
                with open(env_file, 'r') as f:
                    for line in f:
                        if line.strip() and not line.startswith('#'):
                            key, value = line.strip().split('=', 1)
                            os.environ[key] = value.strip('"\'')
            
            url = os.getenv('VITE_SUPABASE_URL')
            # Use service role key for ORDAE system to bypass RLS
            key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('VITE_SUPABASE_ANON_KEY')
            
            if not url or not key:
                print("⚠️  Supabase credentials not found. Using local file storage.")
                return
                
            self.client = create_client(url, key)
            print("✅ Supabase client initialized successfully")
            
        except Exception as e:
            print(f"⚠️  Failed to initialize Supabase client: {e}")
            print("Falling back to local file storage")
    
    def is_connected(self) -> bool:
        """Check if Supabase client is properly initialized"""
        return self.client is not None
    
    def create_persona(self, persona_data: Dict[str, Any], user_id: str = "ordae-system", org_uuid: str = None) -> Optional[str]:
        """Create a persona in Supabase database"""
        if not self.is_connected():
            return None
            
        try:
            # Transform ORDAE persona format to Supabase schema
            supabase_persona = self._transform_to_supabase_format(persona_data, user_id, org_uuid)
            
            # Insert persona into database
            result = self.client.table('personas').insert(supabase_persona).execute()
            
            if result.data and len(result.data) > 0:
                persona_id = result.data[0]['id']
                print(f"✅ Created persona in Supabase: {persona_id}")
                return persona_id
            else:
                print("❌ Failed to create persona in Supabase")
                return None
                
        except Exception as e:
            print(f"❌ Error creating persona in Supabase: {e}")
            return None
    
    def _transform_to_supabase_format(self, ordae_persona: Dict[str, Any], user_id: str, org_uuid: str = None) -> Dict[str, Any]:
        """Transform ORDAE persona format to Supabase database schema"""
        demographics = ordae_persona.get('demographics', {})
        
        return {
            'name': self._format_persona_name(ordae_persona.get('persona_type', ''), 
                                           ordae_persona.get('program', {}).get('name', '')),
            'age_range': demographics.get('age_range'),
            'occupation': ordae_persona.get('persona_type'),
            'industry': self._map_industry(ordae_persona.get('program', {}).get('id', '')),
            'education_level': demographics.get('education'),
            'income_range': demographics.get('income_range'),
            'location': None,  # Could be enhanced with location data
            'personality_traits': self._extract_personality_traits(ordae_persona),
            'values': ordae_persona.get('motivations', []),
            'goals': ordae_persona.get('motivations', []),
            'pain_points': ordae_persona.get('pain_points', []),
            'preferred_channels': ordae_persona.get('preferred_channels', []),
            'description': self._generate_description(ordae_persona),
            'program_category': self._map_program_category(ordae_persona.get('program', {}).get('id', '')),
            'status': 'active',
            'user_id': '00000000-0000-0000-0000-000000000001',  # ORDAE system user
            'organization_id': org_uuid
        }
    
    def _format_persona_name(self, persona_type: str, program_name: str) -> str:
        """Format persona name for display"""
        type_map = {
            'career_changer': 'Career Changer',
            'working_professional': 'Working Professional', 
            'recent_graduate': 'Recent Graduate',
            'tech_professional': 'Tech Professional',
            'career_switcher': 'Career Switcher',
            'international_student': 'International Student'
        }
        
        formatted_type = type_map.get(persona_type, persona_type.replace('_', ' ').title())
        return f"{formatted_type} - {program_name}"
    
    def _map_industry(self, program_id: str) -> Optional[str]:
        """Map program ID to industry"""
        industry_map = {
            'mba': 'Business & Management',
            'online_mba': 'Business & Management',
            'mscs': 'Technology',
            'ms_computer_science': 'Technology'
        }
        return industry_map.get(program_id)
    
    def _map_program_category(self, program_id: str) -> Optional[str]:
        """Map program ID to category"""
        category_map = {
            'mba': 'Business',
            'online_mba': 'Business', 
            'mscs': 'Technology',
            'ms_computer_science': 'Technology'
        }
        return category_map.get(program_id)
    
    def _extract_personality_traits(self, ordae_persona: Dict[str, Any]) -> List[str]:
        """Extract personality traits from behavior patterns"""
        behavior_patterns = ordae_persona.get('behavior_patterns', {})
        traits = []
        
        # Extract traits from decision factors and content preferences
        decision_factors = behavior_patterns.get('decision_factors', [])
        if 'program_reputation' in decision_factors:
            traits.append('Quality-focused')
        if 'flexibility' in decision_factors:
            traits.append('Flexibility-seeking')
        if 'cost' in decision_factors:
            traits.append('Cost-conscious')
        if 'career_outcomes' in decision_factors:
            traits.append('Results-oriented')
            
        return traits or ['Goal-oriented', 'Analytical']
    
    def _generate_description(self, ordae_persona: Dict[str, Any]) -> str:
        """Generate persona description"""
        demographics = ordae_persona.get('demographics', {})
        motivations = ordae_persona.get('motivations', [])
        
        age = demographics.get('age_range', 'N/A')
        income = demographics.get('income_range', 'N/A') 
        education = demographics.get('education', 'N/A')
        
        motivation_text = ', '.join(motivations[:2]) if motivations else 'career growth'
        
        return f"{age} years old, {income} income range, {education}. Motivated by {motivation_text}."
    
    def _get_organization_id(self, university_id: str) -> Optional[str]:
        """Get organization UUID for university by subdomain"""
        if not self.is_connected():
            return None
            
        try:
            result = self.client.table('organizations').select('id').eq('subdomain', university_id).execute()
            if result.data and len(result.data) > 0:
                return result.data[0]['id']
            return None
        except Exception as e:
            print(f"❌ Error getting organization ID: {e}")
            return None
    
    def get_personas_by_organization(self, org_id: str) -> List[Dict[str, Any]]:
        """Retrieve personas for a specific organization"""
        if not self.is_connected():
            return []
            
        try:
            result = self.client.table('personas').select('*').eq('organization_id', org_id).execute()
            return result.data or []
        except Exception as e:
            print(f"❌ Error fetching personas: {e}")
            return []
    
    def create_organization_if_not_exists(self, university_data: Dict[str, Any]) -> Optional[str]:
        """Create organization in Supabase if it doesn't exist"""
        if not self.is_connected():
            return None
            
        try:
            university_id = university_data.get('id', 'msu')
            university_name = university_data.get('name', 'Michigan State University')
            
            # Check if organization exists by subdomain
            existing = self.client.table('organizations').select('id, subdomain').eq('subdomain', university_id).execute()
            
            if existing.data and len(existing.data) > 0:
                org_uuid = existing.data[0]['id']
                print(f"✅ Found existing organization: {university_name} ({org_uuid})")
                return org_uuid
            
            # Create new organization with UUID
            org_uuid = str(uuid.uuid4())
            org_data = {
                'id': org_uuid,
                'name': university_name,
                'subdomain': university_id
            }
            
            result = self.client.table('organizations').insert(org_data).execute()
            
            if result.data and len(result.data) > 0:
                print(f"✅ Created organization: {university_name} ({org_uuid})")
                return org_uuid
            else:
                print(f"❌ Failed to create organization: {university_name}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating organization: {e}")
            return None

# Global instance
supabase_integration = SupabaseIntegration()
