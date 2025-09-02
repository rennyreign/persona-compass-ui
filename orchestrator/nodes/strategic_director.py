"""
Strategic Director - High-level initialization and objective setting
This module handles strategic inputs and translates them into ORDAE objectives
"""
import json
from pathlib import Path
from typing import Dict, Any, List
from rich.console import Console

console = Console()

class StrategicDirector:
    """Handles strategic initialization and objective setting"""
    
    def __init__(self):
        self.repo_root = Path.cwd()
        self.objectives_file = self.repo_root / "persona_data" / "strategic_objectives.json"
        
    def initialize_university_onboarding(self, universities: List[str], programs: List[str] = None) -> Dict[str, Any]:
        """
        Initialize autonomous university onboarding process
        
        Args:
            universities: List of university IDs to onboard
            programs: Optional list of specific programs to focus on
        """
        console.print(f"🎯 [bold blue]Strategic Director:[/bold blue] Initializing university onboarding")
        
        objectives = {
            "mission": "autonomous_university_onboarding",
            "universities": universities,
            "target_programs": programs or ["mba", "online_mba", "mscs"],
            "success_metrics": {
                "personas_per_program": 3,
                "data_completeness_threshold": 0.8,
                "campaign_readiness_score": 0.75
            },
            "constraints": {
                "max_iterations": 10,
                "budget_limit": None,
                "timeline_days": 30
            },
            "status": "active",
            "created_at": str(Path.cwd())
        }
        
        # Save objectives for ORDAE system
        self.objectives_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.objectives_file, 'w') as f:
            json.dump(objectives, f, indent=2)
            
        console.print(f"📋 Objectives saved: {len(universities)} universities, {len(objectives['target_programs'])} programs")
        return objectives
    
    def set_persona_enhancement_goals(self, persona_types: List[str], enhancement_level: str = "comprehensive") -> Dict[str, Any]:
        """
        Set goals for autonomous persona data enhancement
        
        Args:
            persona_types: List of persona types to enhance
            enhancement_level: "basic", "comprehensive", or "advanced"
        """
        enhancement_config = {
            "basic": {
                "required_fields": ["demographics", "motivations", "pain_points"],
                "data_sources": ["template", "synthetic"],
                "validation_threshold": 0.6
            },
            "comprehensive": {
                "required_fields": ["demographics", "motivations", "pain_points", "channels", "behavior_patterns", "conversion_triggers"],
                "data_sources": ["template", "synthetic", "market_research"],
                "validation_threshold": 0.8
            },
            "advanced": {
                "required_fields": ["demographics", "motivations", "pain_points", "channels", "behavior_patterns", "conversion_triggers", "journey_mapping", "attribution_data"],
                "data_sources": ["template", "synthetic", "market_research", "campaign_data"],
                "validation_threshold": 0.9
            }
        }
        
        goals = {
            "mission": "persona_enhancement",
            "target_personas": persona_types,
            "enhancement_level": enhancement_level,
            "config": enhancement_config[enhancement_level],
            "status": "active"
        }
        
        console.print(f"🎨 Persona enhancement goals set: {enhancement_level} level for {len(persona_types)} personas")
        return goals
    
    def monitor_progress(self) -> Dict[str, Any]:
        """Monitor current ORDAE progress against strategic objectives"""
        if not self.objectives_file.exists():
            return {"status": "no_active_objectives"}
            
        with open(self.objectives_file, 'r') as f:
            objectives = json.load(f)
            
        # Check memory ledger for progress
        ledger_file = self.repo_root / "orchestrator" / "memory" / "ledger.json"
        progress = {"objectives": objectives, "iterations_completed": 0, "success_rate": 0}
        
        if ledger_file.exists():
            with open(ledger_file, 'r') as f:
                ledger = json.load(f)
                progress["iterations_completed"] = len(ledger)
                successful_iterations = sum(1 for entry in ledger if entry.get("evaluation", {}).get("success", False))
                progress["success_rate"] = successful_iterations / len(ledger) if ledger else 0
                
        return progress

def initialize_strategic_mission(mission_type: str, **kwargs) -> Dict[str, Any]:
    """
    Main entry point for strategic initialization
    
    Usage examples:
    - initialize_strategic_mission("university_onboarding", universities=["msu", "asu"])
    - initialize_strategic_mission("persona_enhancement", personas=["career_changer", "working_professional"])
    """
    director = StrategicDirector()
    
    if mission_type == "university_onboarding":
        return director.initialize_university_onboarding(
            universities=kwargs.get("universities", []),
            programs=kwargs.get("programs")
        )
    elif mission_type == "persona_enhancement":
        return director.set_persona_enhancement_goals(
            persona_types=kwargs.get("personas", []),
            enhancement_level=kwargs.get("level", "comprehensive")
        )
    else:
        raise ValueError(f"Unknown mission type: {mission_type}")
