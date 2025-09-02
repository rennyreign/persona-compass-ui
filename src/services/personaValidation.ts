import { Persona } from '../types/persona';
import { UniversityContext } from './ai/personaGenerator';
import { RAGDataService } from './ragDataService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100 quality score
}

export interface DuplicateCheck {
  persona: Persona;
  duplicateFields: string[];
  similarity: number; // 0-100 similarity percentage
}

export interface PersonaEnrichment {
  suggestedValues: Record<string, any>;
  missingFields: string[];
  qualityImprovements: string[];
}

export class PersonaValidationService {
  private static readonly REQUIRED_FIELDS = [
    'name', 'age_range', 'occupation', 'income_range', 'education_level',
    'location', 'description', 'program_category', 'goals', 'pain_points',
    'preferred_channels', 'personality_traits', 'values'
  ];

  private static readonly ARRAY_FIELDS = [
    'goals', 'pain_points', 'preferred_channels', 'personality_traits', 'values'
  ];

  /**
   * Comprehensive validation of persona data
   */
  static validatePersonaData(persona: Partial<Persona>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!persona[field as keyof Persona]) {
        errors.push(`Missing required field: ${field}`);
        score -= 10;
      }
    }

    // Validate field formats
    const formatValidation = this.validateFieldFormats(persona);
    errors.push(...formatValidation.errors);
    warnings.push(...formatValidation.warnings);
    score -= formatValidation.errors.length * 5;
    score -= formatValidation.warnings.length * 2;

    // Validate content quality
    const contentValidation = this.validateContentQuality(persona);
    warnings.push(...contentValidation.warnings);
    score -= contentValidation.warnings.length * 3;

    // Validate array fields
    const arrayValidation = this.validateArrayFields(persona);
    errors.push(...arrayValidation.errors);
    warnings.push(...arrayValidation.warnings);
    score -= arrayValidation.errors.length * 5;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Validate field formats and patterns
   */
  private static validateFieldFormats(persona: Partial<Persona>): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Age range validation
    if (persona.age_range) {
      if (!/^\d{2}-\d{2}$/.test(persona.age_range)) {
        errors.push('Age range must be in format "XX-XX" (e.g., "25-35")');
      } else {
        const [min, max] = persona.age_range.split('-').map(Number);
        if (min >= max) {
          errors.push('Age range minimum must be less than maximum');
        }
        if (min < 18 || max > 80) {
          warnings.push('Age range seems unusual for professional personas');
        }
      }
    }

    // Income range validation
    if (persona.income_range) {
      if (!/^\$\d+k-\$\d+k$/i.test(persona.income_range)) {
        errors.push('Income range must be in format "$XXk-$XXk" (e.g., "$50k-$75k")');
      } else {
        const matches = persona.income_range.match(/\$(\d+)k-\$(\d+)k/i);
        if (matches) {
          const [, min, max] = matches.map(Number);
          if (min >= max) {
            errors.push('Income range minimum must be less than maximum');
          }
          if (min < 20 || max > 500) {
            warnings.push('Income range seems unusual for target demographics');
          }
        }
      }
    }

    // Name validation
    if (persona.name) {
      if (persona.name.length < 3) {
        errors.push('Name is too short');
      }
      if (persona.name.length > 100) {
        errors.push('Name is too long');
      }
      if (!/^[a-zA-Z\s\-\.]+(\s-\s[a-zA-Z\s]+)?$/.test(persona.name)) {
        warnings.push('Name format should be "First Last - Title" for consistency');
      }
    }

    // Description validation
    if (persona.description) {
      if (persona.description.length < 20) {
        warnings.push('Description is quite short - consider adding more detail');
      }
      if (persona.description.length > 500) {
        warnings.push('Description is very long - consider condensing');
      }
    }

    return { errors, warnings };
  }

  /**
   * Validate content quality and appropriateness
   */
  private static validateContentQuality(persona: Partial<Persona>): { warnings: string[] } {
    const warnings: string[] = [];

    // Check for placeholder or generic content
    const genericTerms = ['lorem ipsum', 'placeholder', 'example', 'test', 'sample'];
    const checkGeneric = (field: string, value: string) => {
      if (genericTerms.some(term => value.toLowerCase().includes(term))) {
        warnings.push(`${field} contains placeholder content`);
      }
    };

    if (persona.name) checkGeneric('Name', persona.name);
    if (persona.description) checkGeneric('Description', persona.description);
    if (persona.occupation) checkGeneric('Occupation', persona.occupation);

    // Check for professional appropriateness
    const unprofessionalTerms = ['awesome', 'cool', 'amazing', 'fantastic'];
    if (persona.description) {
      unprofessionalTerms.forEach(term => {
        if (persona.description!.toLowerCase().includes(term)) {
          warnings.push('Description contains informal language - consider more professional tone');
        }
      });
    }

    // Check for specificity
    const vaguePhrases = ['various', 'multiple', 'different', 'many'];
    if (persona.description) {
      vaguePhrases.forEach(phrase => {
        if (persona.description!.toLowerCase().includes(phrase)) {
          warnings.push('Description could be more specific');
        }
      });
    }

    return { warnings };
  }

  /**
   * Validate array fields for completeness and quality
   */
  private static validateArrayFields(persona: Partial<Persona>): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const field of this.ARRAY_FIELDS) {
      const value = persona[field as keyof Persona];
      
      if (value) {
        if (!Array.isArray(value)) {
          errors.push(`${field} must be an array`);
          continue;
        }

        if (value.length === 0) {
          warnings.push(`${field} array is empty`);
          continue;
        }

        // Check for duplicates
        const duplicates = value.filter((item, index) => value.indexOf(item) !== index);
        if (duplicates.length > 0) {
          warnings.push(`${field} contains duplicate values: ${duplicates.join(', ')}`);
        }

        // Check array length appropriateness
        const optimalLengths: Record<string, { min: number, max: number }> = {
          goals: { min: 2, max: 5 },
          pain_points: { min: 2, max: 5 },
          preferred_channels: { min: 2, max: 4 },
          personality_traits: { min: 3, max: 6 },
          values: { min: 3, max: 5 }
        };

        const optimal = optimalLengths[field];
        if (optimal) {
          if (value.length < optimal.min) {
            warnings.push(`${field} should have at least ${optimal.min} items`);
          }
          if (value.length > optimal.max) {
            warnings.push(`${field} should have no more than ${optimal.max} items`);
          }
        }

        // Check for empty or very short items
        value.forEach((item, index) => {
          if (typeof item === 'string' && item.trim().length < 2) {
            warnings.push(`${field}[${index}] is too short or empty`);
          }
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Sanitize and clean persona data
   */
  static sanitizePersonaData(persona: Partial<Persona>): Persona {
    const sanitized = { ...persona } as Persona;

    // Trim string fields
    const stringFields = ['name', 'occupation', 'education_level', 'location', 'description', 'program_category'];
    stringFields.forEach(field => {
      if (sanitized[field as keyof Persona]) {
        (sanitized as any)[field] = (sanitized as any)[field].trim();
      }
    });

    // Clean array fields
    this.ARRAY_FIELDS.forEach(field => {
      if (sanitized[field as keyof Persona] && Array.isArray(sanitized[field as keyof Persona])) {
        (sanitized as any)[field] = (sanitized as any)[field]
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0)
          .filter((item: string, index: number, array: string[]) => array.indexOf(item) === index); // Remove duplicates
      }
    });

    // Ensure status is set
    if (!sanitized.status) {
      sanitized.status = 'active';
    }

    // Set timestamps if missing
    const now = new Date().toISOString();
    if (!sanitized.created_at) {
      sanitized.created_at = now;
    }
    sanitized.updated_at = now;

    return sanitized;
  }

  /**
   * Check for duplicate personas in existing dataset
   */
  static checkDuplicates(personas: Persona[], existing: Persona[]): DuplicateCheck[] {
    const duplicates: DuplicateCheck[] = [];

    personas.forEach(persona => {
      existing.forEach(existingPersona => {
        const similarity = this.calculateSimilarity(persona, existingPersona);
        if (similarity > 70) { // 70% similarity threshold
          const duplicateFields = this.findDuplicateFields(persona, existingPersona);
          duplicates.push({
            persona,
            duplicateFields,
            similarity
          });
        }
      });
    });

    return duplicates;
  }

  /**
   * Calculate similarity between two personas
   */
  private static calculateSimilarity(persona1: Persona, persona2: Persona): number {
    let matches = 0;
    let totalFields = 0;

    // Compare string fields
    const stringFields = ['name', 'occupation', 'age_range', 'income_range', 'location', 'program_category'];
    stringFields.forEach(field => {
      totalFields++;
      if (persona1[field as keyof Persona] === persona2[field as keyof Persona]) {
        matches++;
      }
    });

    // Compare array fields (check overlap)
    this.ARRAY_FIELDS.forEach(field => {
      totalFields++;
      const arr1 = persona1[field as keyof Persona] as string[] || [];
      const arr2 = persona2[field as keyof Persona] as string[] || [];
      const overlap = arr1.filter(item => arr2.includes(item)).length;
      const union = [...new Set([...arr1, ...arr2])].length;
      if (union > 0 && overlap / union > 0.5) {
        matches++;
      }
    });

    return (matches / totalFields) * 100;
  }

  /**
   * Find specific duplicate fields between personas
   */
  private static findDuplicateFields(persona1: Persona, persona2: Persona): string[] {
    const duplicateFields: string[] = [];

    // Check exact matches
    const stringFields = ['name', 'occupation', 'age_range', 'income_range', 'location'];
    stringFields.forEach(field => {
      if (persona1[field as keyof Persona] === persona2[field as keyof Persona]) {
        duplicateFields.push(field);
      }
    });

    return duplicateFields;
  }

  /**
   * Enrich persona data with suggestions and improvements
   */
  static async enrichPersonaData(persona: Persona, ragContext: UniversityContext): Promise<Persona> {
    const enriched = { ...persona };

    // Infer industry if missing
    if (!enriched.industry && enriched.program_category) {
      enriched.industry = this.inferIndustry(enriched.program_category);
    }

    // Enhance description if too short
    if (enriched.description && enriched.description.length < 50) {
      enriched.description = await this.enhanceDescription(enriched, ragContext);
    }

    // Add missing personality traits based on occupation
    if (!enriched.personality_traits || enriched.personality_traits.length < 3) {
      enriched.personality_traits = this.suggestPersonalityTraits(enriched);
    }

    // Add missing values based on program category
    if (!enriched.values || enriched.values.length < 3) {
      enriched.values = this.suggestValues(enriched);
    }

    return enriched;
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
      'Finance': 'Financial Services',
      'Marketing': 'Marketing & Advertising',
      'Operations': 'Operations & Manufacturing'
    };

    return industryMap[programCategory] || 'Professional Services';
  }

  /**
   * Enhance description with more detail
   */
  private static async enhanceDescription(persona: Persona, ragContext: UniversityContext): Promise<string> {
    const program = ragContext.programs.find(p => p.category === persona.program_category);
    const baseDescription = persona.description || '';
    
    if (program) {
      return `${baseDescription} Seeking to advance through ${program.name} to develop expertise in ${program.keyBenefits.slice(0, 2).join(' and ')}.`;
    }

    return baseDescription;
  }

  /**
   * Suggest personality traits based on occupation
   */
  private static suggestPersonalityTraits(persona: Persona): string[] {
    const traitMap: Record<string, string[]> = {
      'manager': ['analytical', 'results-oriented', 'strategic-thinking', 'leadership-focused'],
      'coordinator': ['organized', 'detail-oriented', 'collaborative', 'process-focused'],
      'specialist': ['analytical', 'technical', 'problem-solving', 'continuous-learning'],
      'analyst': ['data-driven', 'analytical', 'methodical', 'insight-oriented'],
      'director': ['strategic', 'visionary', 'decisive', 'influential'],
      'supervisor': ['supportive', 'people-focused', 'organized', 'results-driven']
    };

    const occupation = persona.occupation?.toLowerCase() || '';
    for (const [key, traits] of Object.entries(traitMap)) {
      if (occupation.includes(key)) {
        return traits;
      }
    }

    return ['professional', 'goal-oriented', 'analytical', 'growth-minded'];
  }

  /**
   * Suggest values based on program category and occupation
   */
  private static suggestValues(persona: Persona): string[] {
    const valueMap: Record<string, string[]> = {
      'Supply Chain Management': ['efficiency', 'optimization', 'innovation', 'sustainability'],
      'Management and Leadership': ['leadership', 'development', 'results', 'collaboration'],
      'Human Capital Management': ['people-development', 'organizational-health', 'diversity', 'performance']
    };

    return valueMap[persona.program_category || ''] || ['excellence', 'growth', 'integrity', 'innovation'];
  }

  /**
   * Generate quality score for persona
   */
  static calculateQualityScore(persona: Persona): { overall: number; grade: string } {
    const validation = this.validatePersonaData(persona);
    let score = validation.score / 100; // Convert to 0-1 scale

    // Bonus points for completeness
    if (persona.avatar_url) score += 0.05;
    if (persona.visual_identity_images?.length) score += 0.05;
    if (persona.description && persona.description.length > 100) score += 0.05;

    // Bonus for array field richness
    this.ARRAY_FIELDS.forEach(field => {
      const value = persona[field as keyof Persona] as string[];
      if (value && value.length >= 3) score += 0.02;
    });

    const finalScore = Math.min(1, Math.max(0, score));
    
    return {
      overall: finalScore,
      grade: this.getQualityGrade(finalScore)
    };
  }

  /**
   * Get quality grade based on overall score
   */
  private static getQualityGrade(score: number): string {
    if (score >= 0.9) return 'A';
    if (score >= 0.8) return 'B';
    if (score >= 0.7) return 'C';
    if (score >= 0.6) return 'D';
    return 'F';
  }
}
