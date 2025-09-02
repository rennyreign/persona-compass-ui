import { UniversityContext, ProgramData } from './ai/personaGenerator';

export interface MessagingFramework {
  coreMessage: string;
  valuePropositions: string[];
  keyDifferentiators: string[];
  targetAudience: string;
  toneOfVoice: string;
}

export interface PersonaTemplate {
  id: string;
  name: string;
  category: string;
  demographics: string;
  characteristics: string[];
  motivations: string[];
  challenges: string[];
}

export interface UniversityBranding {
  primaryColors: string[];
  secondaryColors: string[];
  logoUrl?: string;
  fontFamily: string;
  visualStyle: string;
  brandPersonality: string[];
}

export class RAGDataService {
  private static universityData: Map<string, UniversityContext> = new Map();
  private static programData: Map<string, ProgramData[]> = new Map();
  private static messagingFrameworks: Map<string, MessagingFramework> = new Map();
  private static personaTemplates: Map<string, PersonaTemplate[]> = new Map();

  /**
   * Initialize with default MSU data
   */
  static initialize() {
    // MSU University Context
    const msuContext: UniversityContext = {
      universityName: 'Michigan State University',
      location: 'East Lansing, Michigan',
      programs: [
        {
          id: 'scm',
          name: 'Supply Chain Management Certificate',
          category: 'Supply Chain Management',
          description: 'Advanced supply chain strategy, analytics, and operations management for experienced professionals',
          targetAudience: 'Operations managers, procurement specialists, logistics coordinators, supply chain analysts',
          keyBenefits: [
            'Strategic supply chain thinking',
            'Advanced analytics and forecasting',
            'Risk management and resilience',
            'Sustainability and ESG integration',
            'Digital transformation strategies'
          ]
        },
        {
          id: 'msl',
          name: 'Management and Leadership Certificate',
          category: 'Management and Leadership',
          description: 'Executive leadership development for emerging and established managers',
          targetAudience: 'Team leaders, project managers, department supervisors, emerging leaders',
          keyBenefits: [
            'Strategic leadership skills',
            'Team management and development',
            'Change management expertise',
            'Organizational effectiveness',
            'Executive presence and communication'
          ]
        },
        {
          id: 'hcm',
          name: 'Human Capital Management Certificate',
          category: 'Human Capital Management',
          description: 'Strategic HR management and talent development for HR professionals',
          targetAudience: 'HR generalists, training coordinators, benefits administrators, talent acquisition specialists',
          keyBenefits: [
            'Strategic HR planning',
            'Talent development and retention',
            'Performance management systems',
            'Compensation and benefits strategy',
            'Employment law and compliance'
          ]
        }
      ],
      brandGuidelines: 'Professional, authoritative, accessible. Focus on practical application and career advancement. Emphasize MSU\'s reputation for excellence and real-world impact.',
      messagingFramework: 'Advance your career through proven expertise, strategic thinking, and MSU\'s world-class education',
      demographics: 'Working professionals aged 25-50, primarily in Midwest and Great Lakes region, seeking career advancement'
    };

    this.universityData.set('msu', msuContext);
    this.programData.set('msu', msuContext.programs);

    // MSU Messaging Framework
    const msuMessaging: MessagingFramework = {
      coreMessage: 'Transform your expertise into strategic leadership advantage',
      valuePropositions: [
        'Proven curriculum developed by industry experts',
        'Flexible online format for working professionals',
        'MSU\'s prestigious reputation and alumni network',
        'Practical application to real business challenges',
        'Career advancement and salary increase potential'
      ],
      keyDifferentiators: [
        'Top-ranked university with 160+ years of excellence',
        'Faculty with real-world industry experience',
        'Cohort-based learning with peer networking',
        'Industry partnerships and guest speakers',
        'Career services and alumni support'
      ],
      targetAudience: 'Ambitious working professionals seeking strategic career advancement',
      toneOfVoice: 'Professional, authoritative, supportive, results-oriented'
    };

    this.messagingFrameworks.set('msu', msuMessaging);

    // MSU Persona Templates
    const msuTemplates: PersonaTemplate[] = [
      {
        id: 'operations-manager',
        name: 'Operations Manager',
        category: 'Supply Chain Management',
        demographics: 'Ages 30-45, $65k-$95k income, Bachelor\'s degree, Midwest manufacturing hubs',
        characteristics: ['analytical', 'results-oriented', 'strategic-thinking', 'process-focused'],
        motivations: ['advance to director level', 'master strategic operations', 'increase compensation', 'gain industry recognition'],
        challenges: ['supply chain disruptions', 'lack of strategic training', 'limited advancement opportunities', 'keeping up with technology']
      },
      {
        id: 'team-leader',
        name: 'Team Leader',
        category: 'Management and Leadership',
        demographics: 'Ages 28-40, $55k-$85k income, Bachelor\'s degree, Various industries',
        characteristics: ['supportive', 'growth-oriented', 'practical', 'people-focused'],
        motivations: ['advance to management role', 'improve leadership skills', 'build stronger teams', 'increase influence'],
        challenges: ['managing difficult team members', 'lack of formal training', 'work-life balance', 'organizational politics']
      },
      {
        id: 'hr-generalist',
        name: 'HR Generalist',
        category: 'Human Capital Management',
        demographics: 'Ages 26-38, $48k-$75k income, Bachelor\'s in HR, Metropolitan areas',
        characteristics: ['people-focused', 'strategic', 'compliance-oriented', 'collaborative'],
        motivations: ['advance to HR manager', 'specialize in strategic HR', 'increase business impact', 'professional recognition'],
        challenges: ['limited strategic involvement', 'need for advanced skills', 'keeping up with regulations', 'proving HR value']
      }
    ];

    this.personaTemplates.set('msu', msuTemplates);
  }

  /**
   * Get university context for persona generation
   */
  static async getUniversityContext(universityId: string): Promise<UniversityContext> {
    if (!this.universityData.has(universityId)) {
      this.initialize();
    }

    const context = this.universityData.get(universityId);
    if (!context) {
      throw new Error(`University context not found for ID: ${universityId}`);
    }

    return context;
  }

  /**
   * Get program data for specific programs
   */
  static async getProgramData(universityId: string, programIds: string[]): Promise<ProgramData[]> {
    const allPrograms = this.programData.get(universityId) || [];
    return allPrograms.filter(program => programIds.includes(program.id));
  }

  /**
   * Get messaging framework for university
   */
  static async getMessagingFramework(universityId: string): Promise<MessagingFramework> {
    const framework = this.messagingFrameworks.get(universityId);
    if (!framework) {
      throw new Error(`Messaging framework not found for university: ${universityId}`);
    }
    return framework;
  }

  /**
   * Get persona templates for university
   */
  static async getPersonaTemplates(universityId: string): Promise<PersonaTemplate[]> {
    return this.personaTemplates.get(universityId) || [];
  }

  /**
   * Get university branding information
   */
  static async getUniversityBranding(universityId: string): Promise<UniversityBranding> {
    // Default MSU branding
    const brandingMap: Record<string, UniversityBranding> = {
      'msu': {
        primaryColors: ['#18453B', '#FFFFFF'],
        secondaryColors: ['#C4B581', '#A5A5A5'],
        fontFamily: 'MSU Fonts, Arial, sans-serif',
        visualStyle: 'Professional, clean, authoritative',
        brandPersonality: ['trustworthy', 'innovative', 'accessible', 'results-driven']
      }
    };

    return brandingMap[universityId] || brandingMap['msu'];
  }

  /**
   * Get all available universities
   */
  static async getAvailableUniversities(): Promise<Array<{id: string, name: string, location: string}>> {
    if (this.universityData.size === 0) {
      this.initialize();
    }

    return Array.from(this.universityData.entries()).map(([id, context]) => ({
      id,
      name: context.universityName,
      location: context.location || 'Not specified'
    }));
  }

  /**
   * Get all programs for a university
   */
  static async getAllPrograms(universityId: string): Promise<ProgramData[]> {
    return this.programData.get(universityId) || [];
  }

  /**
   * Search programs by category or name
   */
  static async searchPrograms(universityId: string, query: string): Promise<ProgramData[]> {
    const allPrograms = await this.getAllPrograms(universityId);
    const lowerQuery = query.toLowerCase();
    
    return allPrograms.filter(program => 
      program.name.toLowerCase().includes(lowerQuery) ||
      program.category.toLowerCase().includes(lowerQuery) ||
      program.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get industry-specific context for persona generation
   */
  static async getIndustryContext(industry: string): Promise<{
    trends: string[];
    challenges: string[];
    opportunities: string[];
    skillRequirements: string[];
  }> {
    const industryContexts: Record<string, any> = {
      'supply-chain': {
        trends: [
          'Digital transformation and automation',
          'Sustainability and ESG requirements',
          'Supply chain resilience and risk management',
          'AI and predictive analytics adoption'
        ],
        challenges: [
          'Global supply chain disruptions',
          'Talent shortage in logistics',
          'Rising transportation costs',
          'Regulatory compliance complexity'
        ],
        opportunities: [
          'Strategic operations leadership roles',
          'Sustainability consulting',
          'Digital transformation projects',
          'Risk management specialization'
        ],
        skillRequirements: [
          'Strategic thinking and planning',
          'Data analysis and interpretation',
          'Risk assessment and mitigation',
          'Cross-functional collaboration'
        ]
      },
      'management': {
        trends: [
          'Hybrid and remote work management',
          'Employee engagement and retention focus',
          'Agile and adaptive leadership',
          'Diversity, equity, and inclusion initiatives'
        ],
        challenges: [
          'Managing distributed teams',
          'Generational workforce differences',
          'Change management complexity',
          'Work-life balance expectations'
        ],
        opportunities: [
          'Executive leadership positions',
          'Organizational development roles',
          'Change management consulting',
          'Team effectiveness coaching'
        ],
        skillRequirements: [
          'Emotional intelligence',
          'Strategic communication',
          'Change management',
          'Performance optimization'
        ]
      },
      'human-resources': {
        trends: [
          'People analytics and HR technology',
          'Employee experience focus',
          'Skills-based hiring and development',
          'Mental health and wellbeing programs'
        ],
        challenges: [
          'Talent acquisition in competitive market',
          'Retention of top performers',
          'Compliance with evolving regulations',
          'Measuring HR impact on business'
        ],
        opportunities: [
          'Strategic HR business partner roles',
          'People analytics specialization',
          'Organizational psychology consulting',
          'HR technology implementation'
        ],
        skillRequirements: [
          'Strategic business thinking',
          'Data analysis and reporting',
          'Employment law knowledge',
          'Organizational development'
        ]
      }
    };

    return industryContexts[industry] || {
      trends: ['Digital transformation', 'Remote work adaptation'],
      challenges: ['Skill gaps', 'Market competition'],
      opportunities: ['Leadership advancement', 'Specialization'],
      skillRequirements: ['Strategic thinking', 'Adaptability']
    };
  }

  /**
   * Add new university data (for future expansion)
   */
  static async addUniversityData(
    universityId: string,
    context: UniversityContext,
    messaging: MessagingFramework,
    templates: PersonaTemplate[]
  ): Promise<void> {
    this.universityData.set(universityId, context);
    this.programData.set(universityId, context.programs);
    this.messagingFrameworks.set(universityId, messaging);
    this.personaTemplates.set(universityId, templates);
  }
}

// Initialize with default data
RAGDataService.initialize();
