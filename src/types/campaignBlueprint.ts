// Campaign Blueprint Framework Types
// Based on the 4-phase campaign design system

export interface CampaignBlueprint {
  id: string;
  name: string;
  status: 'draft' | 'direction' | 'build' | 'optimization' | 'intelligence';
  program_context: {
    program_ids: string[];
    notes: string;
  };
  owners: {
    strategist: string;
    technician_lead: string;
    analyst: string;
  };
  overview: {
    why_now: string;
    who_and_why: string;
    core_message: string;
    message_rationale: string;
    desired_outcomes: string[];
  };
  segments: CampaignSegment[];
  creative_angles: {
    ads: CreativeAngle[];
    emails: EmailAngle[];
  };
  phases: CampaignPhase[];
  assets: CampaignAsset[];
  kpis: CampaignKPI[];
  experiments: CampaignExperiment[];
  desired_intelligence: string[];
  links: {
    video_walkthrough: string;
    docs: string[];
  };
  rag_metadata: {
    namespace: string;
    tags: string[];
    chunking: {
      max_tokens: number;
      overlap_tokens: number;
    };
    index_fields: string[];
  };
  integration_refs: {
    hubspot: {
      campaign_id: string;
      program_ids: string[];
      custom_object_ids: string[];
    };
    airtable: {
      base: string;
      table: string;
      record_id: string;
    };
  };
  governance: {
    version: string;
    reviewers: string[];
    signoff_dates: {
      direction: string;
      build: string;
      launch: string;
    };
  };
  timestamps: {
    created_at: string;
    updated_at: string;
  };
}

export interface CampaignSegment {
  id: string;
  name: string;
  demographics: string;
  characteristics: string;
  motivations: string;
  challenges: string;
  avatars: ConsumerAvatar[];
}

export interface ConsumerAvatar {
  name: string;
  age: number;
  role: string;
  background: string;
  interests: string;
  motivations: string;
  challenges: string;
}

export interface CreativeAngle {
  label: string;
  value_prop: string;
  instructions: string;
  example: string;
}

export interface EmailAngle {
  label: string;
  value_prop: string;
  instructions: string;
}

export interface CampaignPhase {
  name: string;
  objective: string;
  implementation: string;
  status?: 'pending' | 'active' | 'completed';
  start_date?: string;
  end_date?: string;
}

export interface CampaignAsset {
  type: 'doc' | 'video' | 'image' | 'template' | 'copy';
  title: string;
  url: string;
  description?: string;
}

export interface CampaignKPI {
  name: string;
  target: number;
  window: string;
  current?: number;
  unit?: string;
}

export interface CampaignExperiment {
  id: string;
  name: string;
  hypothesis: string;
  variables: string[];
  success_criteria: string;
  status: 'planned' | 'running' | 'completed' | 'paused';
}

// Blueprint Template for new campaigns
export const BLUEPRINT_TEMPLATE: Partial<CampaignBlueprint> = {
  status: 'draft',
  phases: [
    {
      name: "Phase 1: Campaign Launch with Role-Agnostic Messaging",
      objective: "Attract broad audience around universal themes",
      implementation: "Use general but compelling content that resonates universally"
    },
    {
      name: "Phase 2: Audience Segmentation and Data Analysis", 
      objective: "Identify active responders and segment by characteristics",
      implementation: "Analyze engagement metrics to identify distinct groups"
    },
    {
      name: "Phase 3: Targeted Campaign Development",
      objective: "Develop tailored campaigns for identified segments",
      implementation: "Create segment-specific materials addressing unique needs"
    },
    {
      name: "Phase 4: Continuous Optimization and Expansion",
      objective: "Refine messaging and expand based on data",
      implementation: "A/B test segments; discover niche markets within segments"
    }
  ],
  rag_metadata: {
    namespace: "campaigns",
    tags: [],
    chunking: {
      max_tokens: 800,
      overlap_tokens: 80
    },
    index_fields: [
      "overview.core_message",
      "segments.motivations", 
      "creative_angles.ads.instructions",
      "creative_angles.emails.instructions",
      "phases.implementation"
    ]
  }
};
