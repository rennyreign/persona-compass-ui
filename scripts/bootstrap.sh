#!/usr/bin/env bash
set -e
echo "🚀 Bootstrapping PersonaOps ORDAE System..."

# Create Python virtual environment
python -m venv .venv || true
source .venv/bin/activate

# Upgrade pip and install requirements
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Python environment ready."
echo "🐍 Virtual environment: .venv"
echo "📦 Dependencies installed from requirements.txt"
