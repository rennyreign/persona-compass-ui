"""
Analyst Agent (Observe) - Reads persona_data and app repo, detects missing pieces
"""
import json
from pathlib import Path
from typing import Dict, Any
from rich.console import Console

console = Console()

def observe(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Observe current state of persona data and app repository
    Detects what's missing and what needs attention
    """
    console.print("🔍 [bold blue]Analyst Agent:[/bold blue] Observing current state...")
    
    repo_root = Path.cwd()
    persona_data_dir = repo_root / "persona_data"
    app_dir = repo_root / "src"
    
    # Check persona data
    persona_files = []
    if persona_data_dir.exists():
        persona_files = list(persona_data_dir.glob("*.json")) + list(persona_data_dir.glob("*.yaml"))
    
    # Check for strategic objectives
    objectives_file = persona_data_dir / "strategic_objectives.json"
    strategic_objectives = None
    if objectives_file.exists():
        with open(objectives_file, 'r') as f:
            strategic_objectives = json.load(f)
    
    # Check university configuration
    university_config_file = persona_data_dir / "university_config.json"
    university_config = None
    if university_config_file.exists():
        with open(university_config_file, 'r') as f:
            university_config = json.load(f)
    
    # Check app structure
    app_has_attribution_page = False
    if app_dir.exists():
        pages_dir = app_dir / "pages"
        if pages_dir.exists():
            attribution_files = list(pages_dir.glob("*attribution*"))
            app_has_attribution_page = len(attribution_files) > 0
    
    # Check for existing AB plans
    ab_plan_exists = False
    if persona_data_dir.exists():
        ab_plan_exists = (persona_data_dir / "AB_PLAN.md").exists()
    
    # Analyze persona completeness
    persona_analysis = analyze_persona_completeness(persona_data_dir, university_config)
    
    snapshot = {
        "timestamp": str(Path.cwd()),
        "strategic_objectives": strategic_objectives,
        "university_config": university_config,
        "persona_data": {
            "directory_exists": persona_data_dir.exists(),
            "file_count": len(persona_files),
            "files": [f.name for f in persona_files],
            "completeness_analysis": persona_analysis
        },
        "repo_state": {
            "app_exists": app_dir.exists(),
            "app_has_attribution_page": app_has_attribution_page,
            "ab_plan_exists": ab_plan_exists
        },
        "missing_components": []
    }
    
    # Identify missing components based on strategic objectives
    if strategic_objectives:
        mission = strategic_objectives.get("mission")
        if mission == "autonomous_university_onboarding":
            universities = strategic_objectives.get("universities", [])
            for uni in universities:
                if not persona_analysis.get(uni, {}).get("personas_created", False):
                    snapshot["missing_components"].append(f"personas_for_{uni}")
    
    if not persona_data_dir.exists():
        snapshot["missing_components"].append("persona_data_directory")
    
    if not app_has_attribution_page:
        snapshot["missing_components"].append("attribution_page")
    
    if not ab_plan_exists and strategic_objectives and strategic_objectives.get("mission") != "autonomous_university_onboarding":
        snapshot["missing_components"].append("ab_testing_plan")
    
    console.print(f"📊 Found {len(persona_files)} persona files")
    console.print(f"🎯 Strategic objectives: {strategic_objectives.get('mission') if strategic_objectives else 'None'}")
    console.print(f"🏗️  Attribution page exists: {app_has_attribution_page}")
    console.print(f"📋 AB plan exists: {ab_plan_exists}")
    
    state["snapshot"] = snapshot
    return state

def analyze_persona_completeness(persona_data_dir: Path, university_config: dict) -> dict:
    """Analyze completeness of personas for each university"""
    analysis = {}
    
    if not university_config:
        return analysis
    
    for university in university_config.get("universities", []):
        uni_id = university["id"]
        analysis[uni_id] = {
            "personas_created": False,
            "programs_covered": [],
            "missing_personas": []
        }
        
        for program in university.get("programs", []):
            program_id = program["id"]
            target_personas = program.get("target_personas", [])
            
            for persona_type in target_personas:
                persona_file = persona_data_dir / f"{uni_id}_{program_id}_{persona_type}.json"
                if persona_file.exists():
                    analysis[uni_id]["personas_created"] = True
                    if program_id not in analysis[uni_id]["programs_covered"]:
                        analysis[uni_id]["programs_covered"].append(program_id)
                else:
                    analysis[uni_id]["missing_personas"].append(f"{program_id}_{persona_type}")
    
    return analysis
