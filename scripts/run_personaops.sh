#!/usr/bin/env bash
set -e
echo "⚡ Running PersonaOps ORDAE Loop..."

# Activate virtual environment
source .venv/bin/activate || true

# Run the ORDAE orchestrator
python -m orchestrator.graph --run

echo "✅ PersonaOps ORDAE Loop completed."
