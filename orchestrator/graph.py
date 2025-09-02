#!/usr/bin/env python3
"""
PersonaOps ORDAE Graph - Main orchestrator for AI-First OPM system
"""
import json
import typer
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from langgraph.graph import StateGraph, END
from typing import Dict, Any, TypedDict

from .nodes.observe import observe
from .nodes.remember import remember
from .nodes.decide import decide
from .nodes.act import act
from .nodes.evaluate import evaluate

console = Console()

class ORDAEState(TypedDict):
    """State structure for ORDAE loop"""
    snapshot: Dict[str, Any]
    decision: Dict[str, Any]
    actions: Dict[str, Any]
    evaluation: Dict[str, Any]
    iteration: int

def create_ordae_graph():
    """Create the ORDAE workflow graph"""
    workflow = StateGraph(ORDAEState)
    
    # Add nodes
    workflow.add_node("observe", observe)
    workflow.add_node("remember", remember)
    workflow.add_node("decide", decide)
    workflow.add_node("act", act)
    workflow.add_node("evaluate", evaluate)
    
    # Define edges
    workflow.set_entry_point("observe")
    workflow.add_edge("observe", "remember")
    workflow.add_edge("remember", "decide")
    workflow.add_edge("decide", "act")
    workflow.add_edge("act", "evaluate")
    workflow.add_edge("evaluate", END)
    
    return workflow.compile()

def main(run: bool = typer.Option(False, "--run", help="Run the ORDAE loop")):
    """Main entry point for PersonaOps orchestrator"""
    if not run:
        console.print(Panel("PersonaOps ORDAE System Ready", style="green"))
        console.print("Use --run flag to execute the ORDAE loop")
        return
    
    console.print(Panel("🚀 Starting PersonaOps ORDAE Loop", style="bold blue"))
    
    # Initialize state
    initial_state = ORDAEState(
        snapshot={},
        decision={},
        actions={},
        evaluation={},
        iteration=1
    )
    
    # Create and run graph
    graph = create_ordae_graph()
    
    try:
        result = graph.invoke(initial_state)
        console.print(Panel("✅ ORDAE Loop Completed Successfully", style="green"))
        console.print(f"Final state: {json.dumps(result, indent=2)}")
    except Exception as e:
        console.print(Panel(f"❌ ORDAE Loop Failed: {str(e)}", style="red"))
        raise

if __name__ == "__main__":
    typer.run(main)
