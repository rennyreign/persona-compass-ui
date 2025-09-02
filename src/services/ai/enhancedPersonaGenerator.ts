import { OpenAIService } from '../openai';
import { Persona } from '../../types/persona';
import { RAGDataService } from '../ragDataService';
import { PersonaValidationService } from '../personaValidation';

export interface PersonaGenerationRequest {
  prompt: string;
  universityId: string;
  programs: string[];
  count: number;
  generateImages?: boolean;
  intelligenceLevel?: 'basic' | 'advanced' | 'expert';
  templateId?: string;
}

export interface UniversityContext {
  universityName: string;
  programs: ProgramData[];
  brandGuidelines?: string;
  messagingFramework?: string;
  location?: string;
  demographics?: string;
}

export interface ProgramData {
  id: string;
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  keyBenefits: string[];
}

export class EnhancedPersonaGenerator {
  private static readonly TIMEOUT_MS = 30000;
  private static readonly MAX_RETRIES = 3;

  /**
   * Generate multiple personas with intelligence levels
   */
  static async generatePersonas(request: PersonaGenerationRequest): Promise<Persona[]> {
    const context = await RAGDataService.getUniversityContext(request.universityId);
    const personas: Persona[] = [];

    for (let i = 0; i < request.count; i++) {
      try {
        const persona = await this.generateSinglePersona(
          request.prompt, 
          context, 
          request.programs, 
          i + 1,
          request.intelligenceLevel || 'basic'
        );
        
        // Validate and enrich the persona
        const validationResult = PersonaValidationService.validatePersonaData(persona);
        if (validationResult.isValid) {
          const enrichedPersona = this.enrichPersonaData(persona, context);
          personas.push(enrichedPersona);
        } else {
          console.warn(`Persona ${i + 1} validation failed:`, validationResult.errors);
          // Use fallback generation
          const fallbackPersona = this.generateFallbackPersona(request.prompt, context, request.programs, i + 1);
          personas.push(fallbackPersona);
        }
      } catch (error) {
        console.error(`Failed to generate persona ${i + 1}:`, error);
        // Use fallback generation
        const fallbackPersona = this.generateFallbackPersona(request.prompt, context, request.programs, i + 1);
        personas.push(fallbackPersona);
      }
    }

    return personas;
  }

  /**
   * Generate a single persona with AI
   */
  private static async generateSinglePersona(
    prompt: string, 
    context: UniversityContext, 
    programs: string[], 
    index: number,
    intelligenceLevel: string
  ): Promise<Persona> {
    const systemPrompt = this.buildSystemPrompt(context, programs, intelligenceLevel);
    const userPrompt = this.buildUserPrompt(prompt, index);

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const response = await this.callOpenAI(systemPrompt, userPrompt);
        const persona = this.parseAIResponse(response);
        return this.enrichPersonaData(persona, context);
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === this.MAX_RETRIES - 1) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw new Error('All attempts failed');
  }

  /**
   * Build system prompt with intelligence levels
   */
  private static buildSystemPrompt(context: UniversityContext, programs: string[], intelligenceLevel: string): string {
    const basePrompt = `You are an expert marketing persona generator for higher education institutions.

University Context:
- University: ${context.universityName}
- Location: ${context.location || 'Not specified'}
- Target Programs: ${programs.join(', ')}
- Brand Guidelines: ${context.brandGuidelines || 'Standard academic branding'}
- Messaging Framework: ${context.messagingFramework || 'Professional and aspirational'}`;

    const intelligencePrompts = {
      basic: `
Generate realistic personas with:
1. Basic demographic information (name, age, location, background)
2. Educational background and career goals
3. Primary motivations for education
4. Main challenges and pain points
5. Decision factors and timeline
6. Communication preferences
7. Budget considerations`,

      advanced: `
Generate sophisticated personas with:
1. Detailed demographic and psychographic profiling
2. Career trajectory and professional aspirations
3. Deep motivational analysis and behavioral triggers
4. Multi-layered decision-making process
5. Channel preferences with attribution insights
6. Financial modeling and ROI considerations
7. Competitive analysis and differentiation factors
8. University-specific messaging resonance`,

      expert: `
Generate expert-level personas with:
1. Advanced psychographic modeling with predictive psychology
2. Comprehensive competitive positioning and market analysis
3. Complex decision influence mapping and stakeholder analysis
4. Multi-channel attribution and conversion pathway modeling
5. ROI optimization with scenario planning
6. University brand affinity and loyalty factor analysis
7. Market trend adaptation and future-proofing elements
8. Campaign optimization recommendations and creative direction
9. Performance prediction metrics and success indicators`
    };

    return `${basePrompt}

${intelligencePrompts[intelligenceLevel] || intelligencePrompts.basic}

Return a valid JSON object with all required persona fields. Ensure personas are diverse, realistic, and actionable for marketing campaigns.`;
  }

  /**
   * Build user prompt for specific persona
   */
  private static buildUserPrompt(prompt: string, index: number): string {
    return `${prompt}

Generate persona #${index} that fits this description. Make each persona unique and distinct from others that might be generated in this batch.

Return only a valid JSON object with the persona data, no additional text or formatting.`;
  }

  /**
   * Call OpenAI API with timeout and error handling
   */
  private static async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Parse AI response and extract persona data
   */
  private static parseAIResponse(response: string): Persona {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const persona = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const requiredFields = ['name', 'age_range', 'location', 'description', 'goals', 'pain_points'];
      for (const field of requiredFields) {
        if (!persona[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return persona;
    } catch (error) {
      throw new Error(`Invalid response from AI: ${error.message}`);
    }
  }

  /**
   * Enrich persona data with context
   */
  private static enrichPersonaData(persona: Persona, context: UniversityContext): Persona {
    return {
      ...persona,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Generate fallback persona when AI fails
   */
  private static generateFallbackPersona(prompt: string, context: UniversityContext, programs: string[], index: number): Persona {
    const fallbackNames = [
      'Professional Manager', 'Career Specialist', 'Industry Coordinator'
    ];

    return {
      id: `fallback-${Date.now()}-${index}`,
      name: `${fallbackNames[index % fallbackNames.length]} ${index}`,
      age_range: `${30 + (index * 5)}-${40 + (index * 5)}`,
      occupation: 'Professional',
      industry: 'Business',
      education_level: "Bachelor's degree",
      income_range: '$50k-$100k',
      location: context.location || 'United States',
      personality_traits: ['professional', 'goal-oriented'],
      values: ['Excellence', 'Growth', 'Innovation'],
      goals: ['Career advancement', 'Skill development', 'Professional growth'],
      pain_points: ['Time constraints', 'Work-life balance', 'Financial investment'],
      preferred_channels: ['Email', 'LinkedIn'],
      avatar_url: null,
      description: `Experienced professional seeking to advance through ${programs[0] || 'education'} program.`,
      program_category: programs[0] || 'General',
      status: 'active',
      organization_id: null,
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      visual_identity_images: null
    };
  }
}
