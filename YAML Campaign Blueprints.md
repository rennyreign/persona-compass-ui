# YAML Campaign Blueprints

```jsx
id: ""
name: ""
status: draft
program_context:
  program_ids: []
  notes: ""
owners:
  strategist: ""
  technician_lead: ""
  analyst: ""
overview:
  why_now: ""
  who_and_why: ""
  core_message: ""
  message_rationale: ""
  desired_outcomes: []  # e.g., increase enrollments, engagement lift, career-advancement linkage
segments:
  - id: seg-a
    name: ""
    demographics: ""
    characteristics: ""
    motivations: ""
    challenges: ""
    avatars:
      - name: ""
        age: 0
        role: ""
        background: ""
        interests: ""
        motivations: ""
        challenges: ""
creative_angles:
  ads:
    - label: ""
      value_prop: ""
      instructions: ""
      example: ""
  emails:
    - label: ""   # Email 1, Email 2...
      value_prop: ""
      instructions: ""
phases:
  - name: "Phase 1: Campaign Launch with Role-Agnostic Messaging"
    objective: ""
    implementation: ""
  - name: "Phase 2: Audience Segmentation and Data Analysis"
    objective: ""
    implementation: ""
  - name: "Phase 3: Targeted Campaign Development"
    objective: ""
    implementation: ""
  - name: "Phase 4: Continuous Optimization and Expansion"
    objective: ""
    implementation: ""
assets: []
kpis: []
experiments: []
desired_intelligence: []   # explicit questions to answer via data
links:
  video_walkthrough: ""
  docs: []
rag_metadata:
  namespace: "campaigns"
  tags: []
  chunking:
    max_tokens: 800
    overlap_tokens: 80
  index_fields:
    - overview.core_message
    - segments.motivations
    - creative_angles.ads.instructions
    - creative_angles.emails.instructions
    - phases.implementation
integration_refs:
  hubspot:
    campaign_id: ""
    program_ids: []
    custom_object_ids: []   # e.g., Programs / Universities / Public Companies
  airtable:
    base: ""
    table: ""
    record_id: ""
governance:
  version: "1.0.0"
  reviewers: []
  signoff_dates:
    direction: ""
    build: ""
    launch: ""
timestamps:
  created_at: ""
  updated_at: ""

```

## Six Sigma Example

```jsx
{
  "id": "camp-six-sigma-advancement",
  "name": "Six Sigma Certification Advancement",
  "status": "draft",
  "program_context": { "program_ids": ["prog-six-sigma"], "notes": "" },
  "owners": { "strategist": "campaign_strategist@adx", "technician_lead": "tech_lead@adx", "analyst": "analyst@adx" },
  "overview": {
    "why_now": "Operational efficiency and quality control are mission-critical; demand for certified Six Sigma pros is rising.",
    "who_and_why": "Professionals in manufacturing, healthcare, and services involved in process improvement seeking credentialed impact.",
    "core_message": "Master Six Sigma to Drive Efficiency and Excellence in Your Career and Organization.",
    "message_rationale": "Appeals to personal career growth and organizational outcomes.",
    "desired_outcomes": [
      "Increase enrollments in Six Sigma certification",
      "Enhance participant engagement",
      "Strengthen linkage between certification and career advancement"
    ]
  },
  "segments": [
    {
      "id": "seg-early-career",
      "name": "Early-Career Quality Enthusiasts",
      "demographics": "22–30; Quality Analyst, Junior Process Engineer, Associate PM.",
      "characteristics": "Digitally savvy; career-development content consumers.",
      "motivations": "Differentiate early, accelerate advancement.",
      "challenges": "Limited experience; need recognized qualifications.",
      "avatars": []
    },
    {
      "id": "seg-mid-career",
      "name": "Mid-Career Managers",
      "demographics": "31–45; Quality Manager, Process Improvement Manager, Operations Supervisor.",
      "characteristics": "Seeking strategic, higher-impact roles.",
      "motivations": "Career advancement, salary growth, recognition.",
      "challenges": "Avoid stagnation; balance growth with personal responsibilities; time-efficient learning.",
      "avatars": []
    },
    {
      "id": "seg-senior-exec",
      "name": "Senior Executives and Leaders",
      "demographics": "46–60; Director of Operations, VP of Quality, COO.",
      "characteristics": "Decision-makers with broad influence.",
      "motivations": "Legacy of efficiency; strategic direction; mentorship.",
      "challenges": "Stay ahead of trends; advanced knowledge with strategic impact.",
      "avatars": [
        {
          "name": "Jenna Harrison",
          "age": 35,
          "role": "Quality Manager (Pharma)",
          "background": "ChemEng; detail-oriented, analytical",
          "interests": "Professional development, seminars, leadership workshops",
          "motivations": "Ascend to senior management; increase influence",
          "challenges": "Keep up with regulations; manage complex QC; streamline processes"
        },
        {
          "name": "Michael Chen",
          "age": 38,
          "role": "Senior Process Engineer (Automotive)",
          "background": "MS Mechanical Eng; tech integration leader",
          "interests": "Lean, Six Sigma, new process tools",
          "motivations": "Oversee multiple sites; large-scale improvements",
          "challenges": "Varying site standards; slow tech adoption; needs credential signaling leadership capability"
        }
      ]
    }
  ],
  "creative_angles": {
    "ads": [
      {
        "label": "Career Acceleration",
        "value_prop": "Recognized qualifications as early-career differentiator.",
        "instructions": "Convey urgency and rapid advancement potential.",
        "example": "Fast-track your career growth with Six Sigma—start standing out today!"
      },
      {
        "label": "Strategic Impact",
        "value_prop": "Six Sigma tools drive measurable improvements in efficiency and quality.",
        "instructions": "Show business transformation and better strategic decisions.",
        "example": "Drive organizational success: Master Six Sigma to deliver transformative results."
      },
      {
        "label": "Legacy of Leadership",
        "value_prop": "Enhance leadership legacy with advanced operational strategies.",
        "instructions": "Position as essential for senior executives shaping the future.",
        "example": "Lead with excellence: Elevate your legacy with advanced Six Sigma strategies."
      }
    ],
    "emails": [
      {
        "label": "Email 1: Intro to Six Sigma Value",
        "value_prop": "Empower career and organizational efficiency.",
        "instructions": "Inspiring opener with stats/case snippets."
      },
      {
        "label": "Email 2: Methodologies → Outcomes",
        "value_prop": "DMAIC applied to real problems.",
        "instructions": "Demystify tools; include visual aids where possible."
      },
      {
        "label": "Email 3: Success Stories",
        "value_prop": "Testimonials and human narratives.",
        "instructions": "Emotional resonance; cross-industry examples; invite self-projection."
      },
      {
        "label": "Email 4: Live Webinar Invite",
        "value_prop": "Access to experts; future of quality mgmt.",
        "instructions": "Exclusivity + urgency; clear CTA."
      }
    ]
  },
  "phases": [
    {
      "name": "Phase 1: Campaign Launch with Role-Agnostic Messaging",
      "objective": "Attract broad audience around universal career growth.",
      "implementation": "General but compelling content; title-agnostic."
    },
    {
      "name": "Phase 2: Audience Segmentation and Data Analysis",
      "objective": "Identify active responders; segment by job/industry/behavior.",
      "implementation": "Analyze engagement metrics to isolate groups."
    },
    {
      "name": "Phase 3: Targeted Campaign Development",
      "objective": "Tailor to segment-specific pains/aspirations.",
      "implementation": "Build role-specific assets (e.g., IT variants)."
    },
    {
      "name": "Phase 4: Continuous Optimization and Expansion",
      "objective": "Refine messaging and expand niches.",
      "implementation": "A/B tests; discover sub-segments over time."
    }
  ],
  "assets": [
    { "type": "doc", "title": "Blueprint Source", "url": "https://…" },
    { "type": "video", "title": "Walkthrough", "url": "https://…" }
  ],
  "kpis": [
    { "name": "Enrollments", "target": 200, "window": "Quarter" },
    { "name": "Email CTR", "target": 0.045, "window": "First 30 days" }
  ],
  "experiments": [],
  "desired_intelligence": [
    "Which segment shows highest LTV uplift?",
    "Does 'Strategic Impact' angle outperform for managers?"
  ],
  "links": {
    "video_walkthrough": "https://…",
    "docs": ["https://…"]
  },
  "rag_metadata": {
    "namespace": "campaigns/six-sigma",
    "tags": ["six-sigma", "quality", "professional-education"],
    "chunking": { "max_tokens": 800, "overlap_tokens": 80 },
    "index_fields": [
      "overview.core_message",
      "segments.motivations",
      "creative_angles.ads.instructions",
      "creative_angles.emails.instructions",
      "phases.implementation"
    ]
  },
  "integration_refs": {
    "hubspot": {
      "campaign_id": "HS-12345",
      "program_ids": ["HS-PROG-SS"],
      "custom_object_ids": []
    },
    "airtable": { "base": "MarketingOS", "table": "Campaigns", "record_id": "recXXXX" }
  },
  "governance": {
    "version": "1.0.0",
    "reviewers": ["strategist@adx", "analyst@adx"],
    "signoff_dates": { "direction": "", "build": "", "launch": "" }
  },
  "timestamps": { "created_at": "", "updated_at": "" }
}

```