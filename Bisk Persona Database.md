# Bisk Persona Database

---

```markdown
<!-- CASCADE: interpret and implement all instructions below as specification and to-do.
Do not overwrite existing persona/app files. Create or extend orchestrator, scripts,
.windsurf, and memory as described. After setup, run the auto-personaops workflow,
produce preview URL, and update README.md with Demo section. -->

# BRIEF.md

## 🚀 Vision Context (for Cascade + Bisk)

Bisk was founded in 1971 by Tom Bisk as a pioneer in the OPM (online program management) model. The industry hasn’t materially evolved in decades, leaving OPMs bloated, slow, and costly.

This project is not *just* a persona-driven marketing tool — it is a **prototype of an AI-First OPM operating model.**

- Universities (like MSU) only care about *what personas drive enrollment outcomes.*
- But **Bisk** cares about how those insights are delivered: an AI-driven, agentic ecosystem that replaces human bottlenecks with autonomous workflows.

The goal: **prove that we can run an OPM business loop (observe → decide → act → evaluate) entirely through AI agents.**
This project is step one: **PersonaOps.**

---

## 🎯 Project Objective

**PersonaOps** is a persona-driven marketing intelligence system built as an agentic ecosystem.

- **For universities:** A dropdown-selectable platform that shows which personas drive results, what campaigns work, and how to optimize.
- **For Bisk leadership:** Proof that agent orchestration (LangGraph + Windsurf Cascade) can replace manual director/analyst roles and run continuously without human intervention.

The platform must:
1. **Observe** persona data and campaign performance.
2. **Remember** decisions and outcomes in structured memory.
3. **Decide** autonomously between building product features vs. planning marketing campaigns.
4. **Act** by updating the repo, building/deploying, or generating AB test stubs.
5. **Evaluate** results, feeding them back into the loop.

This **ORDAE loop** will demonstrate how AI employees can run core OPM workflows.

---

## 🧩 ORDAE Role Definitions

- **Analyst Agent (Observe):** Reads persona_data and app repo, detects missing pieces.
- **Memory Layer (Remember):** Stores snapshots in ledger.json.
- **Strategist Agent (Decide):** Chooses whether to prioritize product lane or marketing lane.
- **Critic Agent (Evaluate):** Validates outcomes, challenges assumptions, feeds refinements.
- **Director Agent (Act):** Issues concrete build/test/deploy instructions.
- **Builder Agent (Cascade/Windsurf):** Executes commands and produces previews.
- **Authority Agent:** Escalates only if risk or conflict is detected.

---

## 🛠 Technical Instructions for Cascade

### Guardrails
- **Run Mode:** Auto (not Turbo).
- **Allowlist:** `git, npm, pnpm, node, npx, python, pytest, docker build`
- **Denylist:** `rm -rf, shutdown, reboot, mkfs*, dd, curl *| sh`

### Repo Layout

```

/

├─ persona_data/               # persona JSON/YAML

├─ app/                        # Persona Compass app (React/TS/Tailwind)

├─ orchestrator/               # LangGraph ORDAE agents

│  ├─ graph.py

│  ├─ nodes/

│  │  ├─ observe.py

│  │  ├─ remember.py

│  │  ├─ decide.py

│  │  ├─ act.py

│  │  └─ evaluate.py

│  ├─ tools/repo.py

│  ├─ tools/build.py

│  └─ memory/ledger.json

├─ scripts/

│  ├─ bootstrap.sh

│  └─ run_personaops.sh

├─ requirements.txt

├─ README.md

└─ .windsurf/

├─ rules/build_rules.md

└─ workflows/auto-personaops.md

```

### Key Files

#### requirements.txt

```

langgraph>=0.2.0

pydantic>=2.7

typer>=0.12

rich>=13.7

```

#### scripts/bootstrap.sh
```bash
#!/usr/bin/env bash
set -e
python -m venv .venv || true
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Python env ready."

```

### scripts/run_personaops.sh

```bash
#!/usr/bin/env bash
set -e
source .venv/bin/activate || true
python -m orchestrator.graph --run

```

### .windsurf/rules/build_rules.md

```
- Prefer pnpm if lockfile exists; otherwise npm.
- For app/, run: install → build → preview.
- Never run destructive commands without human confirmation.
- Product lane tasks must produce a previewable route before Evaluate.

```

### .windsurf/workflows/auto-personaops.md

```
# title: run-personaops
# description: Run the ORDAE loop for PersonaOps and produce a demo preview
1. Run `bash scripts/bootstrap.sh`
2. Run `bash scripts/run_personaops.sh`
3. If Act step produces build commands, execute them.
4. Capture preview URL and write to README.md "Demo" section.

```

### orchestrator/nodes/decide.py (simplified)

```python
def decide(snapshot: dict):
    if not snapshot["repo_state"]["app_has_attribution_page"]:
        return {"lane": "product", "task": "build_attribution_page"}
    return {"lane": "marketing", "task": "plan_ab_for_first_persona"}

```

### orchestrator/nodes/act.py (simplified)

```python
from pathlib import Path

def act(decision: dict):
    cmds = []
    if decision["lane"] == "product":
        pages = Path("app") / "pages"
        pages.mkdir(parents=True, exist_ok=True)
        target = pages / "attribution.tsx"
        if not target.exists():
            target.write_text("""export default function Attribution(){return (<main><h1>Attribution</h1><p>Stub page for demo.</p></main>)}""")
        cmds += ["# build_app", "echo 'Attribution page created'"]
    elif decision["lane"] == "marketing":
        todo = Path("persona_data") / "AB_PLAN.md"
        if not todo.exists():
            todo.write_text("- [ ] Create AB test for Persona #1: LinkedIn vs Twitter messaging\n")
        cmds += ["# plan_marketing", "echo 'AB plan created'"]
    return {"cmds": cmds}

```

---

## ✅ Expected Outcomes

- `orchestrator/memory/ledger.json` logs ORDAE steps.
- **If product lane chosen:** app has `/attribution` page, preview opens.
- **If marketing lane chosen:** AB_PLAN.md created in persona_data.
- **README.md** updated with preview URL under “Demo.”

---

## 🔮 Future Expansion

- **Real campaign connectors** (FB/Google/LinkedIn).
- **ML-powered predictive analytics** (persona scoring, campaign outcome modeling).
- **Collaboration layer** (approvals, comments, roles).
- **Reporting/export** (PDF, CSV, API).

---

⚡ **Note to Cascade:**

Interpret this file not just as documentation but as a **specification and instruction set.**

- Implement missing files exactly as described.
- Do not overwrite existing app/persona files, only extend.
- Run `auto-personaops` workflow after setup.
- Provide preview URL + ledger summary.

```

---

This way, Cascade will see the very first block (`<!-- CASCADE: … -->`) and know the rest of the file is executable spec.

Do you want me to also add a **one-liner kickoff command** you can paste in Windsurf chat (like `/build-personaops`) that just points Cascade at this `BRIEF.md` so it knows to execute it immediately?

```
