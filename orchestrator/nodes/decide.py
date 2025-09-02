"""
Strategist Agent (Decide) - Chooses whether to prioritize product lane or marketing lane
"""
from typing import Dict, Any
from rich.console import Console

console = Console()

def decide(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze snapshot and decide between product lane vs marketing lane vs university onboarding
    Prioritizes based on strategic objectives and current system state
    """
    console.print("🎯 [bold yellow]Strategist Agent:[/bold yellow] Making strategic decision...")
    
    snapshot = state.get("snapshot", {})
    repo_state = snapshot.get("repo_state", {})
    strategic_objectives = snapshot.get("strategic_objectives")
    missing_components = snapshot.get("missing_components", [])
    
    # Priority 1: Handle strategic university onboarding mission
    if strategic_objectives and strategic_objectives.get("mission") == "autonomous_university_onboarding":
        universities = strategic_objectives.get("universities", [])
        persona_analysis = snapshot.get("persona_data", {}).get("completeness_analysis", {})
        
        # Find first university that needs personas
        for uni in universities:
            if f"personas_for_{uni}" in missing_components:
                decision = {
                    "lane": "university_onboarding",
                    "task": "create_university_personas",
                    "target_university": uni,
                    "reasoning": f"Strategic objective: Create personas for {uni} university programs"
                }
                console.print(f"🎓 Decision: University onboarding - Create personas for {uni}")
                state["decision"] = decision
                return state
        
        # If all universities have personas, move to campaign optimization
        decision = {
            "lane": "marketing",
            "task": "optimize_university_campaigns", 
            "reasoning": "All university personas created - optimizing campaigns"
        }
        console.print("📈 Decision: Marketing lane - Optimize university campaigns")
        state["decision"] = decision
        return state
    
    # Priority 2: Core product infrastructure
    if not repo_state.get("app_has_attribution_page", False):
        decision = {
            "lane": "product",
            "task": "build_attribution_page",
            "reasoning": "Attribution page missing - prioritizing product development"
        }
        console.print("🏗️  Decision: Product lane - Build attribution page")
    else:
        # Priority 3: Marketing optimization
        decision = {
            "lane": "marketing", 
            "task": "plan_ab_for_first_persona",
            "reasoning": "Attribution page exists - focusing on marketing optimization"
        }
        console.print("📈 Decision: Marketing lane - Plan AB testing")
    
    state["decision"] = decision
    return state
