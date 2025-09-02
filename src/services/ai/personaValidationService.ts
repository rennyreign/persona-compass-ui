import { Persona } from '@/types/persona';

export interface QualityScore {
  overall: number;
  grade: string;
  completeness: number;
  specificity: number;
  relevance: number;
  details: {
    missingFields: string[];
    suggestions: string[];
  };
}

export class PersonaValidationService {
  /**
   * Calculate quality score for a persona
   */
  static calculateQualityScore(persona: Persona): QualityScore {
    const completeness = this.calculateCompleteness(persona);
    const specificity = this.calculateSpecificity(persona);
    const relevance = this.calculateRelevance(persona);
    
    const overall = (completeness * 0.4 + specificity * 0.3 + relevance * 0.3);
    const grade = this.getGrade(overall);
    
    return {
      overall,
      grade,
      completeness,
      specificity,
      relevance,
      details: {
        missingFields: this.getMissingFields(persona),
        suggestions: this.getSuggestions(persona)
      }
    };
  }

  /**
   * Calculate completeness score based on filled fields
   */
  private static calculateCompleteness(persona: Persona): number {
    const requiredFields = ['name', 'description', 'program_category'];
    const optionalFields = ['location', 'goals', 'pain_points', 'motivations'];
    
    let score = 0;
    let totalFields = requiredFields.length + optionalFields.length;
    
    // Required fields (weighted more heavily)
    requiredFields.forEach(field => {
      if (persona[field as keyof Persona] && String(persona[field as keyof Persona]).trim()) {
        score += 2; // Required fields worth 2 points
      }
    });
    
    // Optional fields
    optionalFields.forEach(field => {
      const value = persona[field as keyof Persona];
      if (value && (Array.isArray(value) ? value.length > 0 : String(value).trim())) {
        score += 1; // Optional fields worth 1 point
      }
    });
    
    return Math.min(score / (requiredFields.length * 2 + optionalFields.length), 1);
  }

  /**
   * Calculate specificity score based on detail level
   */
  private static calculateSpecificity(persona: Persona): number {
    let score = 0;
    let maxScore = 0;
    
    // Check description length and detail
    if (persona.description) {
      const descLength = persona.description.length;
      maxScore += 1;
      if (descLength > 100) score += 0.5;
      if (descLength > 200) score += 0.5;
    }
    
    // Check goals specificity
    if (persona.goals && Array.isArray(persona.goals)) {
      maxScore += 1;
      if (persona.goals.length >= 3) score += 0.5;
      if (persona.goals.some(goal => goal.length > 20)) score += 0.5;
    }
    
    // Check pain points specificity
    if (persona.pain_points && Array.isArray(persona.pain_points)) {
      maxScore += 1;
      if (persona.pain_points.length >= 2) score += 0.5;
      if (persona.pain_points.some(point => point.length > 15)) score += 0.5;
    }
    
    return maxScore > 0 ? score / maxScore : 0.5;
  }

  /**
   * Calculate relevance score based on program alignment
   */
  private static calculateRelevance(persona: Persona): number {
    let score = 0.5; // Base score
    
    // Check if program category is specified
    if (persona.program_category && persona.program_category.trim()) {
      score += 0.3;
    }
    
    // Check if description mentions relevant terms
    if (persona.description) {
      const relevantTerms = ['education', 'learning', 'career', 'professional', 'skill', 'degree', 'program'];
      const hasRelevantTerms = relevantTerms.some(term => 
        persona.description!.toLowerCase().includes(term)
      );
      if (hasRelevantTerms) score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  /**
   * Get letter grade from numeric score
   */
  private static getGrade(score: number): string {
    if (score >= 0.95) return 'A+';
    if (score >= 0.9) return 'A';
    if (score >= 0.85) return 'A-';
    if (score >= 0.8) return 'B+';
    if (score >= 0.75) return 'B';
    if (score >= 0.7) return 'B-';
    if (score >= 0.65) return 'C+';
    if (score >= 0.6) return 'C';
    if (score >= 0.55) return 'C-';
    if (score >= 0.5) return 'D';
    return 'F';
  }

  /**
   * Get list of missing required fields
   */
  private static getMissingFields(persona: Persona): string[] {
    const missing: string[] = [];
    
    if (!persona.name || !persona.name.trim()) missing.push('name');
    if (!persona.description || !persona.description.trim()) missing.push('description');
    if (!persona.program_category || !persona.program_category.trim()) missing.push('program_category');
    
    return missing;
  }

  /**
   * Get improvement suggestions
   */
  private static getSuggestions(persona: Persona): string[] {
    const suggestions: string[] = [];
    
    if (!persona.description || persona.description.length < 100) {
      suggestions.push('Add more detailed background description');
    }
    
    if (!persona.goals || !Array.isArray(persona.goals) || persona.goals.length < 2) {
      suggestions.push('Add specific educational or career goals');
    }
    
    if (!persona.pain_points || !Array.isArray(persona.pain_points) || persona.pain_points.length < 2) {
      suggestions.push('Include relevant challenges or pain points');
    }
    
    if (!persona.location) {
      suggestions.push('Specify geographic location or market');
    }
    
    return suggestions;
  }

  /**
   * Validate persona data structure
   */
  static validatePersonaStructure(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Name is required and must be a string');
    }
    
    if (!data.program_category || typeof data.program_category !== 'string') {
      errors.push('Program category is required and must be a string');
    }
    
    if (data.goals && !Array.isArray(data.goals)) {
      errors.push('Goals must be an array');
    }
    
    if (data.pain_points && !Array.isArray(data.pain_points)) {
      errors.push('Pain points must be an array');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
