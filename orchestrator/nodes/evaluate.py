"""
Critic Agent (Evaluate) - Validates outcomes, challenges assumptions, feeds refinements
"""
from pathlib import Path
from typing import Dict, Any
from rich.console import Console

console = Console()

def evaluate(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluate the outcomes of actions taken
    Validate results and provide feedback for next iteration
    """
    console.print("🔍 [bold magenta]Critic Agent:[/bold magenta] Evaluating outcomes...")
    
    actions = state.get("actions", {})
    decision = state.get("decision", {})
    snapshot = state.get("snapshot", {})
    
    evaluation = {
        "success": False,
        "validation_results": [],
        "recommendations": [],
        "next_iteration_focus": ""
    }
    
    # Validate product lane outcomes
    if decision.get("lane") == "product":
        repo_root = Path.cwd()
        attribution_file = repo_root / "src" / "pages" / "Attribution.tsx"
        
        if attribution_file.exists():
            evaluation["validation_results"].append("✅ Attribution page successfully created")
            evaluation["success"] = True
            evaluation["next_iteration_focus"] = "marketing_optimization"
            evaluation["recommendations"].append("Ready to focus on AB testing and marketing campaigns")
        else:
            evaluation["validation_results"].append("❌ Attribution page creation failed")
            evaluation["recommendations"].append("Retry attribution page creation with error handling")
    
    # Validate marketing lane outcomes  
    elif decision.get("lane") == "marketing":
        repo_root = Path.cwd()
        ab_plan_file = repo_root / "persona_data" / "AB_PLAN.md"
        
        if ab_plan_file.exists():
            evaluation["validation_results"].append("✅ AB testing plan successfully created")
            evaluation["success"] = True
            evaluation["next_iteration_focus"] = "campaign_execution"
            evaluation["recommendations"].append("Execute AB test campaigns and monitor results")
        else:
            evaluation["validation_results"].append("❌ AB testing plan creation failed")
            evaluation["recommendations"].append("Retry AB plan creation with proper directory structure")
    
    # General system health checks
    files_created = actions.get("files_created", [])
    if files_created:
        evaluation["validation_results"].append(f"📁 Created {len(files_created)} files successfully")
    
    # Challenge assumptions and provide critical feedback
    missing_components = snapshot.get("missing_components", [])
    if missing_components:
        evaluation["recommendations"].append(f"Address remaining missing components: {', '.join(missing_components)}")
    
    # Suggest improvements
    if evaluation["success"]:
        evaluation["recommendations"].append("Consider implementing real campaign connectors (FB/Google/LinkedIn)")
        evaluation["recommendations"].append("Add ML-powered predictive analytics for persona scoring")
    
    console.print(f"📊 Evaluation complete - Success: {evaluation['success']}")
    for result in evaluation["validation_results"]:
        console.print(f"   {result}")
    
    state["evaluation"] = evaluation
    return state
