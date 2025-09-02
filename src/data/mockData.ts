// This file has been deprecated - all data is now database-driven
// Temporary exports to prevent build errors during transition

export interface Persona {
  id: string;
  name: string;
  program: string;
  ageRange: string;
  careerStage: string;
  avatar?: string;
  motivationalTagline: string;
  goals: string[];
  fears: string[];
  motivations: string[];
  channels: string[];
  demographics: {
    location: string;
    income: string;
    education: string;
  };
  psychographics: {
    values: string[];
    interests: string[];
    lifestyle: string;
  };
  programNeeds: string[];
  performance: {
    cpl: number;
    ctr: number;
    conversionRate: number;
    totalSpend: number;
    totalLeads: number;
  };
  moodBoardImages: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'persona_created' | 'campaign_launched' | 'insight_generated' | 'performance_alert';
  title: string;
  description: string;
  timestamp: string;
  personaId?: string;
  campaignId?: string;
}

export interface Insight {
  id: string;
  personaId: string;
  title: string;
  content: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'trend';
  generatedAt: string;
  isGptGenerated: boolean;
}

// Empty arrays - all data should come from database
export const mockPersonas: Persona[] = [];
export const mockInsights: Insight[] = [];
export const mockActivities: Activity[] = [];
