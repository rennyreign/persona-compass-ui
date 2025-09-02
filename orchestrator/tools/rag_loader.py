"""
RAG Knowledge Base Loader for PersonaOps ORDAE System
Loads university brand guidelines, program catalogs, and messaging frameworks
"""
import yaml
import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from rich.console import Console

console = Console()

class RAGLoader:
    """Loads and manages RAG knowledge base for ORDAE agents"""
    
    def __init__(self):
        self.repo_root = Path.cwd()
        self.rag_dir = self.repo_root / "rag"
        self._cache = {}
        
    def load_university_brand_guidelines(self, university_id: str) -> Dict[str, Any]:
        """Load brand guidelines for a specific university"""
        cache_key = f"brand_{university_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]
            
        brand_file = self.rag_dir / "universities" / university_id / "brand_guidelines.yaml"
        if brand_file.exists():
            with open(brand_file, 'r') as f:
                data = yaml.safe_load(f)
                self._cache[cache_key] = data
                return data
        return {}
    
    def load_university_voice_tone(self, university_id: str) -> Dict[str, Any]:
        """Load voice and tone guidelines for a specific university"""
        cache_key = f"voice_{university_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]
            
        voice_file = self.rag_dir / "universities" / university_id / "voice_tone.yaml"
        if voice_file.exists():
            with open(voice_file, 'r') as f:
                data = yaml.safe_load(f)
                self._cache[cache_key] = data
                return data
        return {}
    
    def load_university_messaging(self, university_id: str) -> Dict[str, Any]:
        """Load messaging framework for a specific university"""
        cache_key = f"messaging_{university_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]
            
        messaging_file = self.rag_dir / "universities" / university_id / "messaging_framework.yaml"
        if messaging_file.exists():
            with open(messaging_file, 'r') as f:
                data = yaml.safe_load(f)
                self._cache[cache_key] = data
                return data
        return {}
    
    def load_program_catalog(self, university_id: str) -> Dict[str, Any]:
        """Load program catalog for a specific university"""
        cache_key = f"programs_{university_id}"
        if cache_key in self._cache:
            return self._cache[cache_key]
            
        catalog_file = self.rag_dir / "program_catalog" / f"{university_id}_programs.yaml"
        if catalog_file.exists():
            with open(catalog_file, 'r') as f:
                data = yaml.safe_load(f)
                self._cache[cache_key] = data
                return data
        return {}
    
    def get_program_details(self, university_id: str, program_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific program"""
        catalog = self.load_program_catalog(university_id)
        
        # Search in programs
        for program in catalog.get("programs", []):
            if program.get("id") == program_id:
                return program
                
        # Search in certificates
        for cert in catalog.get("certificates", []):
            if cert.get("id") == program_id:
                return cert
                
        return None
    
    def get_persona_messaging(self, university_id: str, persona_key: str) -> Dict[str, Any]:
        """Get persona-specific messaging for a university"""
        brand_guidelines = self.load_university_brand_guidelines(university_id)
        voice_guidelines = self.load_university_voice_tone(university_id)
        
        persona_messaging = {}
        
        # Get brand messaging for persona
        brand_personas = brand_guidelines.get("target_messaging_by_persona", {})
        if persona_key in brand_personas:
            persona_messaging["brand"] = brand_personas[persona_key]
            
        # Get voice guidelines for persona
        voice_personas = voice_guidelines.get("persona_specific_voice", {})
        if persona_key in voice_personas:
            persona_messaging["voice"] = voice_personas[persona_key]
            
        return persona_messaging
    
    def get_campaign_messaging(self, university_id: str, campaign_stage: str) -> Dict[str, Any]:
        """Get campaign messaging for specific stage (awareness, consideration, conversion)"""
        messaging = self.load_university_messaging(university_id)
        
        campaign_messages = messaging.get("campaign_messaging", {})
        stage_key = f"{campaign_stage}_campaigns"
        
        if stage_key in campaign_messages:
            return campaign_messages[stage_key]
            
        return {}
    
    def get_university_context(self, university_id: str) -> Dict[str, Any]:
        """Get complete university context for ORDAE agents"""
        return {
            "brand_guidelines": self.load_university_brand_guidelines(university_id),
            "voice_tone": self.load_university_voice_tone(university_id),
            "messaging_framework": self.load_university_messaging(university_id),
            "program_catalog": self.load_program_catalog(university_id)
        }
    
    def validate_content_against_brand(self, university_id: str, content: str) -> Dict[str, Any]:
        """Validate generated content against brand guidelines"""
        brand_guidelines = self.load_university_brand_guidelines(university_id)
        voice_guidelines = self.load_university_voice_tone(university_id)
        
        validation = {
            "compliant": True,
            "issues": [],
            "suggestions": []
        }
        
        # Check for required elements
        compliance = brand_guidelines.get("compliance_requirements", {})
        if compliance.get("accreditation_mention") and "AACSB" not in content:
            validation["issues"].append("Missing required AACSB accreditation mention")
            validation["compliant"] = False
            
        # Check for avoided language
        avoid_words = voice_guidelines.get("language_preferences", {}).get("avoid_words", [])
        for word in avoid_words:
            if word.lower() in content.lower():
                validation["issues"].append(f"Contains avoided word: '{word}'")
                validation["suggestions"].append(f"Consider alternative to '{word}'")
        
        return validation

# Global RAG loader instance
rag_loader = RAGLoader()
