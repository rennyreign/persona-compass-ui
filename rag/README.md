# RAG Knowledge Base

This folder contains the central reference point for university information that PersonaOps ORDAE agents use for decision-making and content generation.

## Structure

```
rag/
├── universities/           # University-specific brand and guidelines
│   ├── msu/
│   │   ├── brand_guidelines.yaml
│   │   ├── voice_tone.yaml
│   │   └── messaging_framework.yaml
│   └── [other_universities]/
├── program_catalog/        # Detailed program information
│   ├── msu_programs.yaml
│   └── [other_university_programs].yaml
└── templates/             # Reusable templates and frameworks
    ├── persona_templates.yaml
    └── campaign_templates.yaml
```

## Usage

The ORDAE agents automatically reference this knowledge base during:
- **Observe phase**: Understanding university requirements and constraints
- **Decide phase**: Making strategic decisions aligned with brand guidelines
- **Act phase**: Creating content that matches university voice and messaging
- **Evaluate phase**: Validating outputs against brand standards

## Data Sources

- University official websites
- Program pages and catalogs  
- Brand style guides
- Marketing materials and campaigns
- Admissions requirements and processes
