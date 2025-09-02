#!/usr/bin/env python3
"""
Strategic Mission Initializer for PersonaOps ORDAE System
Usage: python scripts/initialize_mission.py [mission_type] [options]
"""
import sys
import argparse
from pathlib import Path

# Add orchestrator to path
sys.path.append(str(Path(__file__).parent.parent))

from orchestrator.nodes.strategic_director import initialize_strategic_mission
from rich.console import Console

console = Console()

def main():
    parser = argparse.ArgumentParser(description="Initialize PersonaOps strategic missions")
    parser.add_argument("mission", choices=["university_onboarding", "persona_enhancement"], 
                       help="Type of mission to initialize")
    parser.add_argument("--universities", nargs="+", default=["msu", "asu"],
                       help="University IDs for onboarding mission")
    parser.add_argument("--programs", nargs="+", 
                       help="Specific programs to focus on")
    parser.add_argument("--personas", nargs="+", default=["career_changer", "working_professional"],
                       help="Persona types for enhancement mission")
    parser.add_argument("--level", choices=["basic", "comprehensive", "advanced"], 
                       default="comprehensive", help="Enhancement level for personas")
    
    args = parser.parse_args()
    
    console.print(f"🚀 [bold blue]Initializing {args.mission} mission...[/bold blue]")
    
    try:
        if args.mission == "university_onboarding":
            result = initialize_strategic_mission(
                "university_onboarding",
                universities=args.universities,
                programs=args.programs
            )
            console.print(f"✅ University onboarding initialized for: {', '.join(args.universities)}")
            
        elif args.mission == "persona_enhancement":
            result = initialize_strategic_mission(
                "persona_enhancement", 
                personas=args.personas,
                level=args.level
            )
            console.print(f"✅ Persona enhancement initialized: {args.level} level for {', '.join(args.personas)}")
        
        console.print("\n🎯 [bold green]Mission initialized successfully![/bold green]")
        console.print("Run the ORDAE loop to begin autonomous execution:")
        console.print("  [bold cyan]bash scripts/run_personaops.sh[/bold cyan]")
        
    except Exception as e:
        console.print(f"❌ [bold red]Mission initialization failed:[/bold red] {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
