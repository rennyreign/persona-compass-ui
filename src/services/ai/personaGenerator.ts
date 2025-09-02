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

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class AIPersonaGenerator {
  private static readonly TIMEOUT_MS = 30000;
  private static readonly MAX_RETRIES = 3;

  /**
   * Generate multiple personas based on user prompt and university context
   */
  static async generatePersonas(request: PersonaGenerationRequest): Promise<Persona[]> {
    const context = await this.getUniversityContext(request.universityId);
    const personas: Persona[] = [];

    for (let i = 0; i < request.count; i++) {
      try {
        const persona = await this.generateSinglePersona(
          request.prompt,
          context,
          request.programs,
          i + 1
        );
        personas.push(persona);
      } catch (error) {
        console.error(`Failed to generate persona ${i + 1}:`, error);
        // Continue with other personas even if one fails
      }
    }

    return personas;
  }

  /**
   * Generate a single persona using AI
   */
  static async generateSinglePersona(
    prompt: string,
    context: UniversityContext,
    programs: string[],
    index: number = 1
  ): Promise<Persona> {
    const systemPrompt = this.buildSystemPrompt(context, programs);
    const userPrompt = this.buildUserPrompt(prompt, index);

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await this.callOpenAI(systemPrompt, userPrompt);
        const persona = this.parseAIResponse(response);
        return this.enrichPersonaData(persona, context);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed for persona generation:`, error);
        
        if (attempt < this.MAX_RETRIES) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // If all retries failed, use fallback generation
    console.warn('AI generation failed, using fallback template');
    return this.generateFallbackPersona(prompt, context, programs, index);
  }

  /**
   * Build system prompt with university context
   */
  private static buildSystemPrompt(context: UniversityContext, programs: string[], intelligenceLevel: string = 'basic'): string {
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
13. values: Array of 3-4 core values
14. status: Always "active"

IMPORTANT: 
- Make personas realistic and diverse
- Ensure they align with the target programs
- Include specific, actionable details
- Use professional language appropriate for higher education marketing
- Vary demographics, backgrounds, and characteristics
- Focus on working professionals seeking career advancement

Format response as a valid JSON object with all required fields. Do not include any markdown formatting or code blocks.`;
  }

  /**
   * Build user prompt with specific requirements
   */
  private static buildUserPrompt(prompt: string, index: number): string {
    return `${prompt}

Generate persona #${index} that fits this description. Make this persona unique and distinct from others that might be generated in this batch.

Return only a valid JSON object with the persona data - no additional text or formatting.`;
  }

  /**
   * Call OpenAI API with timeout and error handling
   */
  private static async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    // Get API key from environment or throw error
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return data.choices[0].message.content;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse AI response into persona object
   */
  private static parseAIResponse(response: string): Partial<Persona> {
    try {
      // Clean up response - remove any markdown formatting
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      
      // Validate required fields
      const validation = this.validatePersonaData(parsed);
      if (!validation.isValid) {
        throw new Error(`Invalid persona data: ${validation.errors.join(', ')}`);
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error(`Invalid JSON response from AI: ${error}`);
    }
  }

  /**
   * Validate persona data structure
   */
  private static validatePersonaData(persona: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const requiredFields = [
      'name', 'age_range', 'occupation', 'income_range', 'education_level',
      'location', 'description', 'program_category', 'goals', 'pain_points',
      'preferred_channels', 'personality_traits', 'values'
    ];

    for (const field of requiredFields) {
      if (!persona[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate array fields
    const arrayFields = ['goals', 'pain_points', 'preferred_channels', 'personality_traits', 'values'];
    for (const field of arrayFields) {
      if (persona[field] && !Array.isArray(persona[field])) {
        errors.push(`Field ${field} must be an array`);
      }
    }

    // Validate age range format
    if (persona.age_range && !/^\d{2}-\d{2}$/.test(persona.age_range)) {
      warnings.push('Age range should be in format "XX-XX"');
    }

    // Validate income range format
    if (persona.income_range && !/^\$\d+k-\$\d+k$/.test(persona.income_range)) {
      warnings.push('Income range should be in format "$XXk-$XXk"');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Enrich persona data with additional context
   */
  private static enrichPersonaData(persona: Partial<Persona>, context: UniversityContext): Persona {
    const now = new Date().toISOString();
    
    return {
      id: '', // Will be set by database
      name: persona.name || 'Unknown Professional',
      age_range: persona.age_range || '30-40',
      occupation: persona.occupation || 'Professional',
      industry: this.inferIndustry(persona.program_category || ''),
      income_range: persona.income_range || '$50k-$80k',
      education_level: persona.education_level || "Bachelor's degree",
      location: persona.location || context.location || 'Metropolitan area',
      personality_traits: persona.personality_traits || ['professional', 'goal-oriented'],
      values: persona.values || ['growth', 'excellence'],
      goals: persona.goals || ['career advancement'],
      pain_points: persona.pain_points || ['skill gaps'],
      preferred_channels: persona.preferred_channels || ['LinkedIn', 'email'],
      description: persona.description || 'Experienced professional seeking career advancement',
      program_category: persona.program_category || 'Professional Development',
      avatar_url: null,
      status: 'active',
      organization_id: null, // Will be set when saving
      user_id: '', // Will be set when saving
      created_at: now,
      updated_at: now,
      visual_identity_images: null
    };
  }

  /**
   * Generate fallback persona when AI fails
   */
  private static generateFallbackPersona(
    prompt: string,
    context: UniversityContext,
    programs: string[],
    index: number
  ): Persona {
    const templates = [
      {
        name: `Professional ${index} - Manager`,
        occupation: 'Manager',
        age_range: '30-40',
        income_range: '$60k-$90k'
      },
      {
        name: `Professional ${index} - Specialist`,
        occupation: 'Specialist',
        age_range: '25-35',
        income_range: '$50k-$75k'
      },
      {
        name: `Professional ${index} - Coordinator`,
        occupation: 'Coordinator',
        age_range: '28-38',
        income_range: '$45k-$70k'
      }
    ];

    const template = templates[index % templates.length];
    const program = context.programs.find(p => programs.includes(p.id));

    return this.enrichPersonaData({
      ...template,
      program_category: program?.category || 'Professional Development',
      description: `Experienced ${template.occupation.toLowerCase()} seeking to advance through ${program?.name || 'professional development'}`,
      goals: ['career advancement', 'skill development'],
      pain_points: ['limited opportunities', 'skill gaps'],
      preferred_channels: ['LinkedIn', 'email'],
      personality_traits: ['ambitious', 'analytical', 'results-oriented'],
      values: ['growth', 'excellence', 'innovation'],
      education_level: "Bachelor's degree",
      location: context.location || 'Metropolitan area'
    }, context);
  }

  /**
   * Get university context (placeholder - would integrate with RAG service)
   */
  private static async getUniversityContext(universityId: string): Promise<UniversityContext> {
    // This would integrate with the RAG data service
    // For now, return MSU context as default
    return {
      universityName: 'Michigan State University',
      location: 'Michigan, USA',
      programs: [
        {
          id: 'scm',
          name: 'Supply Chain Management',
          category: 'Supply Chain Management',
          description: 'Advanced supply chain strategy and operations',
          targetAudience: 'Operations professionals',
          keyBenefits: ['Strategic thinking', 'Analytics mastery', 'Leadership skills']
        },
        {
          id: 'msl',
          name: 'Management and Leadership',
          category: 'Management and Leadership',
          description: 'Executive leadership development',
          targetAudience: 'Emerging leaders',
          keyBenefits: ['Leadership skills', 'Team management', 'Strategic planning']
        },
        {
          id: 'hcm',
          name: 'Human Capital Management',
          category: 'Human Capital Management',
          description: 'Strategic HR and talent management',
          targetAudience: 'HR professionals',
          keyBenefits: ['Strategic HR', 'Talent development', 'Organizational design']
        }
      ],
      brandGuidelines: 'Professional, academic excellence, career-focused',
      messagingFramework: 'Advance your career through proven expertise and strategic thinking'
    };
  }

  /**
   * Infer industry from program category
   */
  private static inferIndustry(programCategory: string): string {
    const industryMap: Record<string, string> = {
      'Supply Chain Management': 'Manufacturing & Logistics',
      'Management and Leadership': 'Business & Management',
      'Human Capital Management': 'Human Resources',
      'Healthcare Management': 'Healthcare',
      'Technology Management': 'Technology',
      'Finance': 'Financial Services'
    };

    return industryMap[programCategory] || 'Professional Services';
  }
}
