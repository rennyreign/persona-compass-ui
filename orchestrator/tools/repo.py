"""
Repository management tools for ORDAE system
"""
import subprocess
from pathlib import Path
from typing import List, Dict, Any
from rich.console import Console

console = Console()

def get_repo_status() -> Dict[str, Any]:
    """Get current repository status and structure"""
    repo_root = Path.cwd()
    
    status = {
        "root": str(repo_root),
        "git_status": get_git_status(),
        "structure": analyze_structure(),
        "dependencies": check_dependencies()
    }
    
    return status

def get_git_status() -> Dict[str, Any]:
    """Get git repository status"""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            cwd=Path.cwd()
        )
        
        return {
            "clean": result.returncode == 0 and not result.stdout.strip(),
            "modified_files": result.stdout.strip().split('\n') if result.stdout.strip() else [],
            "branch": get_current_branch()
        }
    except Exception as e:
        return {"error": str(e)}

def get_current_branch() -> str:
    """Get current git branch"""
    try:
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            capture_output=True,
            text=True,
            cwd=Path.cwd()
        )
        return result.stdout.strip() if result.returncode == 0 else "unknown"
    except Exception:
        return "unknown"

def analyze_structure() -> Dict[str, Any]:
    """Analyze repository structure"""
    repo_root = Path.cwd()
    
    structure = {
        "has_src": (repo_root / "src").exists(),
        "has_orchestrator": (repo_root / "orchestrator").exists(),
        "has_persona_data": (repo_root / "persona_data").exists(),
        "has_package_json": (repo_root / "package.json").exists(),
        "has_requirements_txt": (repo_root / "requirements.txt").exists()
    }
    
    return structure

def check_dependencies() -> Dict[str, Any]:
    """Check if dependencies are installed"""
    repo_root = Path.cwd()
    
    deps = {
        "node_modules": (repo_root / "node_modules").exists(),
        "python_venv": (repo_root / ".venv").exists(),
        "requirements_installed": False
    }
    
    # Check if Python requirements are satisfied
    if deps["python_venv"]:
        try:
            result = subprocess.run(
                [".venv/bin/python", "-c", "import langgraph, pydantic, typer, rich"],
                capture_output=True,
                cwd=repo_root
            )
            deps["requirements_installed"] = result.returncode == 0
        except Exception:
            deps["requirements_installed"] = False
    
    return deps
