"""
Memory Layer (Remember) - Stores snapshots in ledger.json
"""
import json
from pathlib import Path
from typing import Dict, Any
from datetime import datetime
from rich.console import Console

console = Console()

def remember(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Store current snapshot and decisions in persistent memory ledger
    """
    console.print("💾 [bold green]Memory Layer:[/bold green] Recording snapshot...")
    
    repo_root = Path.cwd()
    memory_dir = repo_root / "orchestrator" / "memory"
    memory_dir.mkdir(parents=True, exist_ok=True)
    
    ledger_path = memory_dir / "ledger.json"
    
    # Load existing ledger or create new one
    ledger = []
    if ledger_path.exists():
        try:
            with open(ledger_path, 'r') as f:
                ledger = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            ledger = []
    
    # Create new entry
    entry = {
        "timestamp": datetime.now().isoformat(),
        "iteration": state.get("iteration", 1),
        "snapshot": state.get("snapshot", {}),
        "decision": state.get("decision", {}),
        "actions": state.get("actions", {}),
        "evaluation": state.get("evaluation", {})
    }
    
    # Add to ledger
    ledger.append(entry)
    
    # Keep only last 50 entries to prevent bloat
    if len(ledger) > 50:
        ledger = ledger[-50:]
    
    # Save ledger
    with open(ledger_path, 'w') as f:
        json.dump(ledger, f, indent=2)
    
    console.print(f"📝 Recorded entry #{len(ledger)} in ledger")
    console.print(f"💿 Ledger location: {ledger_path}")
    
    return state
