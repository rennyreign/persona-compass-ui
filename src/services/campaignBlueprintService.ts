import { CampaignBlueprint, BLUEPRINT_TEMPLATE, CampaignSegment, ConsumerAvatar } from '../types/campaignBlueprint';
import { supabase } from '../integrations/supabase/client';
import { GPTBlueprintGenerator } from './ai/gptBlueprint';

export class CampaignBlueprintService {
  
  /**
   * Create a new campaign blueprint from template
   */
  static createFromTemplate(
    name: string, 
    programIds: string[] = [],
    owners: Partial<CampaignBlueprint['owners']> = {}
  ): CampaignBlueprint {
    const now = new Date().toISOString();
    const id = `camp-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    return {
      ...BLUEPRINT_TEMPLATE,
      id,
      name,
      program_context: {
        program_ids: programIds,
        notes: ''
      },
      owners: {
        strategist: owners.strategist || '',
        technician_lead: owners.technician_lead || '',
        analyst: owners.analyst || ''
      },
      overview: {
        why_now: '',
        who_and_why: '',
        core_message: '',
        message_rationale: '',
        desired_outcomes: []
      },
      segments: [],
      creative_angles: {
        ads: [],
        emails: []
      },
      assets: [],
      kpis: [],
      experiments: [],
      desired_intelligence: [],
      links: {
        video_walkthrough: '',
        docs: []
      },
      integration_refs: {
        hubspot: {
          campaign_id: '',
          program_ids: [],
          custom_object_ids: []
        },
        airtable: {
          base: '',
          table: '',
          record_id: ''
        }
      },
      governance: {
        version: '1.0.0',
        reviewers: [],
        signoff_dates: {
          direction: '',
          build: '',
          launch: ''
        }
      },
      timestamps: {
        created_at: now,
        updated_at: now
      }
    } as CampaignBlueprint;
  }

  /**
   * Generate blueprint from persona data
   */
  static generateFromPersona(personaData: any, programContext?: any): CampaignBlueprint {
    const blueprint = this.createFromTemplate(
      `${programContext?.name || 'Program'} - ${personaData.name}`,
      programContext?.id ? [programContext.id] : []
    );

    // Map persona to campaign overview
    blueprint.overview = {
      why_now: this.generateWhyNow(personaData, programContext),
      who_and_why: this.generateWhoAndWhy(personaData),
      core_message: this.generateCoreMessage(personaData, programContext),
      message_rationale: this.generateMessageRationale(personaData),
      desired_outcomes: this.generateDesiredOutcomes(programContext)
    };

    // Create primary segment from persona
    const primarySegment: CampaignSegment = {
      id: `seg-${personaData.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: personaData.name,
      demographics: personaData.demographics || '',
      characteristics: personaData.characteristics || '',
      motivations: personaData.motivations || '',
      challenges: personaData.challenges || '',
      avatars: [{
        name: personaData.name,
        age: personaData.age || 35,
        role: personaData.role || '',
        background: personaData.background || '',
        interests: personaData.interests || '',
        motivations: personaData.motivations || '',
        challenges: personaData.challenges || ''
      }]
    };

    blueprint.segments = [primarySegment];

    // Generate creative angles based on persona
    blueprint.creative_angles = this.generateCreativeAngles(personaData, programContext);

    // Set RAG metadata
    blueprint.rag_metadata.namespace = `campaigns/${blueprint.id}`;
    blueprint.rag_metadata.tags = [
      personaData.name.toLowerCase().replace(/\s+/g, '-'),
      programContext?.category?.toLowerCase() || 'education',
      'persona-driven'
    ];

    return blueprint;
  }

  /**
   * Generate blueprint using GPT when configured; fallback to template logic
   */
  static async generateFromPersonaAI(personaData: any, programContext?: any): Promise<CampaignBlueprint> {
    // Try GPT-backed generation first if configured
    if (GPTBlueprintGenerator.isConfigured()) {
      const aiBlueprint = await GPTBlueprintGenerator.generateBlueprint(personaData, programContext);
      if (aiBlueprint) {
        // Ensure required fields and RAG metadata are set
        aiBlueprint.program_context = aiBlueprint.program_context || {
          program_ids: programContext?.id ? [programContext.id] : [],
          notes: ''
        };
        const defaultTags = [
          String(personaData.name || 'persona').toLowerCase().replace(/\s+/g, '-'),
          String(programContext?.category || 'education').toLowerCase(),
          'persona-driven'
        ];
        aiBlueprint.rag_metadata = {
          namespace: aiBlueprint.rag_metadata?.namespace || `campaigns/${aiBlueprint.id}`,
          tags: (aiBlueprint.rag_metadata?.tags && aiBlueprint.rag_metadata.tags.length > 0)
            ? aiBlueprint.rag_metadata.tags
            : defaultTags,
          chunking: aiBlueprint.rag_metadata?.chunking || { max_tokens: 800, overlap_tokens: 80 },
          index_fields: aiBlueprint.rag_metadata?.index_fields || [
            'overview.core_message',
            'segments.motivations',
            'creative_angles.ads.instructions',
            'creative_angles.emails.instructions',
            'phases.implementation'
          ]
        } as CampaignBlueprint['rag_metadata'];
        return aiBlueprint;
      }
    }

    // Fallback to deterministic template generation
    return this.generateFromPersona(personaData, programContext);
  }

  /**
   * Generate campaign blueprint from AI-generated persona with enhanced context
   */
  static async generateFromAIPersona(persona: any, ragContext: any): Promise<CampaignBlueprint> {
    const blueprint = this.createFromTemplate(
      `${ragContext?.universityName || 'University'} - ${persona.name}`,
      ragContext?.programs?.map((p: any) => p.id) || []
    );

    // Enhanced mapping for AI-generated personas
    blueprint.overview = {
      why_now: this.generateEnhancedWhyNow(persona, ragContext),
      who_and_why: this.generateEnhancedWhoAndWhy(persona, ragContext),
      core_message: this.generateEnhancedCoreMessage(persona, ragContext),
      message_rationale: this.generateEnhancedMessageRationale(persona, ragContext),
      desired_outcomes: this.generateEnhancedDesiredOutcomes(persona, ragContext)
    };

    // Create enhanced segment from AI persona
    const primarySegment: CampaignSegment = {
      id: `seg-${persona.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: persona.name,
      demographics: this.formatDemographics(persona),
      characteristics: this.formatCharacteristics(persona),
      motivations: persona.goals?.join(', ') || '',
      challenges: persona.pain_points?.join(', ') || '',
      avatars: [{
        name: persona.name,
        age: this.extractAge(persona.age_range),
        role: persona.occupation || '',
        background: persona.description || '',
        interests: persona.personality_traits?.join(', ') || '',
        motivations: persona.goals?.join(', ') || '',
        challenges: persona.pain_points?.join(', ') || ''
      }]
    };

    blueprint.segments = [primarySegment];

    // Generate enhanced creative angles
    blueprint.creative_angles = this.generateEnhancedCreativeAngles(persona, ragContext);

    // Set enhanced RAG metadata
    blueprint.rag_metadata.namespace = `campaigns/${blueprint.id}`;
    blueprint.rag_metadata.tags = [
      persona.name.toLowerCase().replace(/\s+/g, '-'),
      persona.program_category?.toLowerCase().replace(/\s+/g, '-') || 'education',
      'ai-generated',
      'persona-driven',
      ragContext?.universityName?.toLowerCase().replace(/\s+/g, '-') || 'university'
    ];

    return blueprint;
  }

  /**
   * Bulk generate campaign blueprints from multiple AI personas
   */
  static async bulkGenerateFromPersonas(personas: any[], ragContext: any): Promise<CampaignBlueprint[]> {
    const blueprints: CampaignBlueprint[] = [];
    
    for (const persona of personas) {
      try {
        const blueprint = await this.generateFromAIPersona(persona, ragContext);
        blueprints.push(blueprint);
      } catch (error) {
        console.error(`Failed to generate blueprint for persona ${persona.name}:`, error);
        // Continue with other personas
      }
    }

    return blueprints;
  }

  // Enhanced helper methods for AI personas
  private static generateEnhancedWhyNow(persona: any, ragContext: any): string {
    const universityName = ragContext?.universityName || 'the university';
    const programCategory = persona.program_category || 'professional development';
    const industryContext = this.getIndustryContext(programCategory);
    
    return `${industryContext} ${persona.name} professionals are experiencing unprecedented demand for advanced skills in ${programCategory.toLowerCase()}. ${universityName}'s reputation for excellence and practical application makes this the ideal time to invest in strategic professional development. Current market conditions, including talent shortages and increased competition, have created a critical window for career advancement through specialized education.`;
  }

  private static generateEnhancedWhoAndWhy(persona: any, ragContext: any): string {
    const demographics = this.formatDemographics(persona);
    const motivations = persona.goals?.join(', ') || 'career advancement';
    
    return `Our primary target is ${persona.name} - ${demographics}. These professionals are strategically positioned for growth but face specific challenges: ${persona.pain_points?.join(', ') || 'skill gaps and limited advancement opportunities'}. Their motivation for ${motivations} aligns perfectly with our program outcomes. They represent high-value prospects with clear ROI expectations and the authority to invest in their professional development.`;
  }

  private static generateEnhancedCoreMessage(persona: any, ragContext: any): string {
    const universityName = ragContext?.universityName || 'University';
    const programName = ragContext?.programs?.find((p: any) => p.category === persona.program_category)?.name || persona.program_category;
    
    return `${universityName} ${programName}: Transform Your ${persona.occupation} Expertise Into Strategic Leadership Advantage`;
  }

  private static generateEnhancedMessageRationale(persona: any, ragContext: any): string {
    const personalityTraits = persona.personality_traits?.join(', ') || 'professional characteristics';
    const values = persona.values?.join(', ') || 'core values';
    
    return `This messaging framework strategically addresses ${persona.name}'s ${personalityTraits} while appealing to their ${values}. By positioning the program as a transformation catalyst rather than just education, we tap into their aspirational identity while acknowledging their current expertise. The messaging creates urgency through competitive differentiation while building confidence through peer validation and proven outcomes.`;
  }

  private static generateEnhancedDesiredOutcomes(persona: any, ragContext: any): string[] {
    const programCategory = persona.program_category || 'Professional Development';
    return [
      `Achieve 40% increase in qualified ${programCategory} program enrollments within 90 days`,
      `Generate 200+ high-intent leads per month with 30% conversion rate`,
      `Build brand recognition as the premier provider in ${programCategory.toLowerCase()}`,
      `Establish thought leadership position in the ${persona.industry || 'professional'} industry`,
      `Create a community of 750+ engaged alumni advocates`,
      `Achieve 95%+ participant satisfaction and completion rates`,
      `Generate $3.5M+ in program revenue within 12 months`,
      `Develop strategic partnerships with 15+ industry organizations`
    ];
  }

  private static generateEnhancedCreativeAngles(persona: any, ragContext: any) {
    const occupation = persona.occupation || 'professional';
    const programCategory = persona.program_category || 'professional development';
    const goals = persona.goals || ['career advancement'];
    const painPoints = persona.pain_points || ['skill gaps'];
    
    return {
      ads: [
        {
          label: 'Career Transformation Focus',
          value_prop: `Transform your ${occupation} expertise into strategic leadership advantage`,
          instructions: `Target ${persona.name} professionals seeking ${goals.join(' and ')}. Address their challenges with ${painPoints.join(' and ')}. Use transformation language and specific career outcomes.`,
          example: `Ready to elevate beyond ${occupation}? Our proven ${programCategory} program has helped 3,000+ professionals advance to senior leadership roles in just 18 months.`
        },
        {
          label: 'Industry Authority & Recognition',
          value_prop: 'Become the recognized expert and thought leader in your field',
          instructions: `Position ${persona.name} as an emerging thought leader in ${programCategory}. Focus on industry recognition and expert status. Use social proof and authority indicators.`,
          example: `Join the elite 5% of ${occupation} professionals who are shaping the future of ${programCategory}. Gain the credentials, network, and insights that industry leaders trust.`
        },
        {
          label: 'ROI & Business Impact',
          value_prop: 'Deliver measurable business results and demonstrate clear ROI',
          instructions: `Focus on quantifiable outcomes for ${persona.name} professionals. Use specific metrics and ROI calculations. Appeal to their analytical mindset.`,
          example: `${occupation} professionals in our program average 45% salary increases and deliver $750K+ in measurable business value within their first year.`
        }
      ],
      emails: [
        {
          label: 'Email 1: Industry Disruption & Opportunity',
          value_prop: `Position the program as essential for ${occupation} professionals navigating industry changes`,
          instructions: `Open with ${programCategory}-specific disruption. Create urgency around ${painPoints.join(' and ')}. Position program as the solution.`
        },
        {
          label: 'Email 2: Success Story & Social Proof',
          value_prop: 'Demonstrate program effectiveness through peer success',
          instructions: `Feature a detailed case study of a similar ${occupation} who achieved ${goals.join(' and ')}. Include specific metrics and career progression.`
        },
        {
          label: 'Email 3: Curriculum Deep Dive',
          value_prop: 'Showcase program depth and practical application',
          instructions: `Provide detailed overview addressing ${persona.name}'s specific challenges: ${painPoints.join(', ')}. Show how curriculum solves their problems.`
        }
      ]
    };
  }

  private static formatDemographics(persona: any): string {
    const parts = [];
    if (persona.age_range) parts.push(`ages ${persona.age_range}`);
    if (persona.income_range) parts.push(`${persona.income_range} income`);
    if (persona.location) parts.push(`located in ${persona.location}`);
    if (persona.education_level) parts.push(`${persona.education_level} education`);
    return parts.join(', ');
  }

  private static formatCharacteristics(persona: any): string {
    const traits = persona.personality_traits || [];
    const values = persona.values || [];
    return [...traits, ...values].join(', ');
  }

  private static extractAge(ageRange: string): number {
    if (!ageRange) return 35;
    const match = ageRange.match(/(\d+)-(\d+)/);
    if (match) {
      const [, min, max] = match.map(Number);
      return Math.floor((min + max) / 2);
    }
    return 35;
  }

  /**
   * Convert existing campaign to blueprint format
   */
  static convertCampaignToBlueprint(campaign: any): CampaignBlueprint {
    const blueprint = this.createFromTemplate(campaign.name);
    
    // Map existing campaign data to blueprint structure
    blueprint.overview = {
      why_now: campaign.description || '',
      who_and_why: `Targeting ${campaign.persona_name}`,
      core_message: campaign.objectives?.[0] || '',
      message_rationale: 'Converted from existing campaign',
      desired_outcomes: campaign.objectives || []
    };

    // Convert persona to segment
    if (campaign.persona_name) {
      blueprint.segments = [{
        id: `seg-${campaign.persona_name.toLowerCase().replace(/\s+/g, '-')}`,
        name: campaign.persona_name,
        demographics: '',
        characteristics: '',
        motivations: '',
        challenges: '',
        avatars: []
      }];
    }

    // Convert creative assets to angles
    if (campaign.creative_assets) {
      blueprint.creative_angles.ads = campaign.creative_assets
        .filter((asset: any) => asset.type === 'ad_copy')
        .map((asset: any, index: number) => ({
          label: `Angle ${index + 1}`,
          value_prop: asset.content.substring(0, 100) + '...',
          instructions: 'Converted from existing creative asset',
          example: asset.content
        }));
    }

    return blueprint;
  }

  /**
   * Save blueprint to database (using campaigns table with blueprint_data column)
   */
  static async saveBlueprint(blueprint: CampaignBlueprint): Promise<{ data: any; error: any }> {
    // Store blueprint data in the campaigns table with a special blueprint_data field
    // Store blueprint data in localStorage for now since we need to add blueprint support to DB
    if (typeof window !== 'undefined') {
      localStorage.setItem(`blueprint_${blueprint.id}`, JSON.stringify(blueprint));
    }

    // Return success for localStorage storage
    return { data: { id: blueprint.id }, error: null };
  }

  /**
   * Load blueprint from database
   */
  static async loadBlueprint(id: string): Promise<{ data: CampaignBlueprint | null; error: any }> {
    // Try localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`blueprint_${id}`);
      if (stored) {
        try {
          return { data: JSON.parse(stored), error: null };
        } catch (e) {
          console.warn('Failed to parse stored blueprint:', e);
        }
      }
    }

    // Fallback to reconstructing from campaigns table
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('campaign_type', 'blueprint')
      .single();

    if (error) return { data: null, error };
    
    // Convert campaign back to blueprint format
    if (data) {
      const blueprint = this.createFromTemplate(data.title);
      blueprint.id = data.id;
      blueprint.overview.why_now = data.description || '';
      blueprint.overview.desired_outcomes = data.objectives || [];
      blueprint.timestamps.created_at = data.created_at;
      blueprint.timestamps.updated_at = data.updated_at;
      return { data: blueprint, error: null };
    }
    
    return { data: null, error: null };
  }

  // Helper methods for enhanced content generation
  private static generateWhyNow(personaData: any, programContext: any): string {
    const industryContext = this.getIndustryContext(personaData.program_category);
    const urgencyFactors = this.getUrgencyFactors(personaData.program_category);
    
    return `${industryContext} ${personaData.name} professionals are facing unprecedented challenges and opportunities in today's rapidly evolving business landscape. ${urgencyFactors} Organizations are actively seeking professionals with advanced ${programContext?.category || 'specialized skills'} to drive strategic initiatives, optimize operations, and maintain competitive advantage. The convergence of digital transformation, regulatory changes, and market volatility has created a critical skills gap that presents both challenges and career advancement opportunities for forward-thinking professionals.`;
  }

  private static generateWhoAndWhy(personaData: any): string {
    const roleSpecifics = this.getRoleSpecifics(personaData.occupation);
    const motivationAnalysis = this.getMotivationAnalysis(personaData);
    
    return `Our primary target is ${personaData.name} - ${roleSpecifics} These professionals are strategically positioned within their organizations but face the challenge of evolving their skill sets to meet emerging business demands. ${motivationAnalysis} They represent a high-value segment with strong purchasing power, clear ROI expectations, and the authority to invest in professional development. Their career trajectory and organizational influence make them ideal candidates for advanced certification programs that deliver measurable business impact.`;
  }

  private static generateCoreMessage(personaData: any, programContext: any): string {
    const valueProposition = this.getValueProposition(personaData.program_category);
    return `${valueProposition} - ${programContext?.name || 'Advanced Professional Development'}: Where ${personaData.name} Professionals Transform Expertise into Strategic Leadership`;
  }

  private static generateMessageRationale(personaData: any): string {
    return `This message framework strategically addresses ${personaData.name}'s dual motivations: immediate skill enhancement and long-term career advancement. By positioning the program as a transformation catalyst rather than just education, we tap into their aspirational identity while acknowledging their current expertise. The messaging creates urgency through competitive differentiation while building confidence through peer validation and proven outcomes. This approach resonates with their analytical mindset and results-oriented decision-making process.`;
  }

  private static generateDesiredOutcomes(programContext: any): string[] {
    return [
      'Achieve 35% increase in qualified program enrollments within 90 days',
      'Generate 150+ high-intent leads per month with 25% conversion rate',
      'Build brand recognition as the premier provider in professional development',
      'Establish thought leadership position in the industry',
      'Create a community of 500+ engaged alumni advocates',
      'Achieve 90%+ participant satisfaction and completion rates',
      'Generate $2.5M+ in program revenue within 12 months',
      'Develop strategic partnerships with 10+ industry organizations'
    ];
  }

  private static generateCreativeAngles(personaData: any, programContext: any) {
    const industryInsights = this.getIndustryInsights(personaData.program_category);
    const competitiveAdvantages = this.getCompetitiveAdvantages(programContext);
    
    return {
      ads: [
        {
          label: 'Strategic Career Acceleration',
          value_prop: `Transform your ${personaData.occupation} expertise into strategic leadership advantage`,
          instructions: `Focus on rapid career progression and competitive differentiation. Emphasize transformation from tactical to strategic thinking. Use power words: "accelerate," "transform," "advance," "lead." Include specific career outcomes and timeline promises.`,
          example: `Ready to accelerate beyond ${personaData.occupation}? Our proven framework has helped 2,000+ professionals advance to senior leadership roles in just 18 months. Transform your expertise into strategic advantage.`
        },
        {
          label: 'Industry Authority & Recognition',
          value_prop: 'Become the recognized expert and thought leader in your field',
          instructions: `Position the persona as an emerging thought leader. Focus on industry recognition, peer respect, and expert status. Use social proof and authority indicators. Emphasize exclusive access and elite community.`,
          example: `Join the elite 5% of ${personaData.occupation} professionals who are shaping the future of ${personaData.program_category}. Gain the credentials, network, and insights that industry leaders trust.`
        },
        {
          label: 'ROI & Business Impact',
          value_prop: 'Deliver measurable business results and demonstrate clear ROI',
          instructions: `Focus on quantifiable business outcomes and financial impact. Use specific metrics, case studies, and ROI calculations. Appeal to their analytical mindset and results-oriented approach.`,
          example: `${personaData.name} professionals in our program average 40% salary increases and deliver $500K+ in measurable business value within their first year. Calculate your ROI potential.`
        },
        {
          label: 'Future-Proofing & Innovation',
          value_prop: 'Stay ahead of industry disruption and emerging trends',
          instructions: `Address industry evolution, technological disruption, and future skills requirements. Create urgency around staying relevant and competitive. Focus on innovation and forward-thinking approaches.`,
          example: `While others react to change, ${personaData.name} leaders shape it. Master the emerging skills and strategic frameworks that will define the next decade of ${personaData.program_category}.`
        },
        {
          label: 'Peer Network & Community',
          value_prop: 'Connect with an exclusive network of high-achieving professionals',
          instructions: `Emphasize the value of peer connections, networking opportunities, and community support. Focus on quality over quantity of connections. Highlight ongoing relationships and career-long benefits.`,
          example: `Join 500+ ${personaData.name} executives who are driving innovation across Fortune 500 companies. Your next career opportunity, strategic partnership, or breakthrough insight is one conversation away.`
        }
      ],
      emails: [
        {
          label: 'Email 1: Industry Disruption & Opportunity',
          value_prop: 'Position the program as essential for navigating industry changes',
          instructions: `Open with industry-specific disruption or trend. Create urgency around skill gaps and competitive threats. Position the program as the solution for staying ahead. Include compelling statistics and industry insights.`
        },
        {
          label: 'Email 2: Success Story & Social Proof',
          value_prop: 'Demonstrate program effectiveness through peer success',
          instructions: `Feature a detailed case study of a similar professional who achieved significant results. Include specific metrics, timeline, and career progression. Make the success story relatable and aspirational.`
        },
        {
          label: 'Email 3: Curriculum Deep Dive & Value Proposition',
          value_prop: 'Showcase program depth and practical application',
          instructions: `Provide detailed overview of curriculum, learning methodology, and practical applications. Address common objections about time investment and relevance. Include faculty credentials and industry partnerships.`
        },
        {
          label: 'Email 4: Exclusive Access & Limited Availability',
          value_prop: 'Create urgency through scarcity and exclusivity',
          instructions: `Emphasize selective admission process and limited cohort size. Highlight exclusive benefits like executive mentorship, industry access, and alumni network. Create FOMO around missing this opportunity.`
        },
        {
          label: 'Email 5: ROI Calculator & Final Call to Action',
          value_prop: 'Quantify the investment value and drive enrollment decision',
          instructions: `Provide interactive ROI calculator or detailed cost-benefit analysis. Address financial concerns and payment options. Include strong guarantee or risk-reversal offer. Create urgency with enrollment deadline.`
        }
      ]
    };
  }

  // Enhanced helper methods for richer content
  private static getIndustryContext(category: string): string {
    const contexts = {
      'Supply Chain Management': 'Global supply chain disruptions, sustainability mandates, and digital transformation initiatives are reshaping the logistics landscape.',
      'Management and Leadership': 'The shift to hybrid work models, generational workforce changes, and increased focus on employee engagement are redefining leadership requirements.',
      'Human Capital Management': 'Evolving workplace dynamics, compliance complexities, and the war for talent are creating new challenges for HR professionals.',
      'default': 'Rapid technological advancement and changing market dynamics are creating new challenges and opportunities across industries.'
    };
    return contexts[category as keyof typeof contexts] || contexts.default;
  }

  private static getUrgencyFactors(category: string): string {
    const factors = {
      'Supply Chain Management': 'Recent supply chain crises have elevated the strategic importance of logistics and operations expertise.',
      'Management and Leadership': 'Organizations are investing heavily in leadership development to navigate unprecedented business challenges.',
      'Human Capital Management': 'The Great Resignation and evolving workplace expectations have made strategic HR expertise more valuable than ever.',
      'default': 'Market leaders are investing in advanced skills development to maintain competitive advantage.'
    };
    return factors[category as keyof typeof factors] || factors.default;
  }

  private static getRoleSpecifics(occupation: string): string {
    return `experienced ${occupation} professionals who have demonstrated tactical excellence and are ready to transition into strategic leadership roles.`;
  }

  private static getMotivationAnalysis(personaData: any): string {
    return `They are driven by career advancement, increased compensation, and the desire to make meaningful organizational impact. Their challenges include staying current with industry best practices, developing strategic thinking capabilities, and building the credibility needed for senior leadership positions.`;
  }

  private static getValueProposition(category: string): string {
    const props = {
      'Supply Chain Management': 'Master Strategic Operations Excellence',
      'Management and Leadership': 'Elevate Your Leadership Impact',
      'Human Capital Management': 'Transform HR into Strategic Advantage',
      'default': 'Accelerate Your Professional Impact'
    };
    return props[category as keyof typeof props] || props.default;
  }

  private static getIndustryInsights(category: string): string[] {
    return [
      `${category} professionals with advanced certifications earn 35% more than their peers`,
      'Strategic thinking skills are the #1 differentiator for leadership advancement',
      'Industry leaders invest 40+ hours annually in continuous learning and development'
    ];
  }

  private static getCompetitiveAdvantages(programContext: any): string[] {
    return [
      'Exclusive access to industry thought leaders and practitioners',
      'Hands-on application of frameworks to real business challenges',
      'Ongoing mentorship and career guidance from senior executives'
    ];
  }
}
