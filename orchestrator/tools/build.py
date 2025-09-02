"""
Build and deployment tools for ORDAE system
"""
import subprocess
from pathlib import Path
from typing import List, Dict, Any
from rich.console import Console

console = Console()

def build_app() -> Dict[str, Any]:
    """Build the React application"""
    repo_root = Path.cwd()
    
    try:
        # Check if we should use pnpm or npm
        use_pnpm = (repo_root / "pnpm-lock.yaml").exists()
        package_manager = "pnpm" if use_pnpm else "npm"
        
        console.print(f"🔨 Building app with {package_manager}...")
        
        # Install dependencies first
        install_result = subprocess.run(
            [package_manager, "install"],
            capture_output=True,
            text=True,
            cwd=repo_root
        )
        
        if install_result.returncode != 0:
            return {
                "success": False,
                "error": f"Failed to install dependencies: {install_result.stderr}",
                "step": "install"
            }
        
        # Build the application
        build_result = subprocess.run(
            [package_manager, "run", "build"],
            capture_output=True,
            text=True,
            cwd=repo_root
        )
        
        if build_result.returncode != 0:
            return {
                "success": False,
                "error": f"Build failed: {build_result.stderr}",
                "step": "build"
            }
        
        return {
            "success": True,
            "message": "App built successfully",
            "package_manager": package_manager
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "step": "exception"
        }

def start_preview() -> Dict[str, Any]:
    """Start preview server for the built application"""
    repo_root = Path.cwd()
    
    try:
        use_pnpm = (repo_root / "pnpm-lock.yaml").exists()
        package_manager = "pnpm" if use_pnpm else "npm"
        
        console.print(f"🚀 Starting preview with {package_manager}...")
        
        # Start preview (non-blocking)
        preview_result = subprocess.Popen(
            [package_manager, "run", "preview"],
            cwd=repo_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        return {
            "success": True,
            "message": "Preview server started",
            "process_id": preview_result.pid,
            "url": "http://localhost:4173"  # Default Vite preview port
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def check_build_requirements() -> Dict[str, Any]:
    """Check if build requirements are met"""
    repo_root = Path.cwd()
    
    requirements = {
        "package_json_exists": (repo_root / "package.json").exists(),
        "node_modules_exists": (repo_root / "node_modules").exists(),
        "src_directory_exists": (repo_root / "src").exists(),
        "has_build_script": False
    }
    
    # Check if build script exists in package.json
    if requirements["package_json_exists"]:
        try:
            import json
            with open(repo_root / "package.json", 'r') as f:
                package_data = json.load(f)
                scripts = package_data.get("scripts", {})
                requirements["has_build_script"] = "build" in scripts
        except Exception:
            requirements["has_build_script"] = False
    
    requirements["ready_to_build"] = all([
        requirements["package_json_exists"],
        requirements["node_modules_exists"],
        requirements["src_directory_exists"],
        requirements["has_build_script"]
    ])
    
    return requirements
