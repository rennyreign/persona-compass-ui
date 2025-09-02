import { supabase } from '@/integrations/supabase/client';
import { Persona } from '../../types/persona';

export interface GenerationSession {
  id: string;
  prompt: string;
  university_id: string;
  programs: string[];
  intelligence_level: 'basic' | 'advanced' | 'expert';
  template_id?: string;
  persona_count: number;
  generated_personas: string[]; // Array of persona IDs
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  completed_at?: string;
  generation_time_ms?: number;
}

export interface SessionStats {
  totalSessions: number;
  successfulSessions: number;
  failedSessions: number;
  totalPersonasGenerated: number;
  averageGenerationTime: number;
  mostUsedIntelligenceLevel: string;
  mostUsedTemplate?: string;
}

export class GenerationSessionService {
  /**
   * Create a new generation session
   * NOTE: This service is currently disabled as the generation_sessions table doesn't exist
   */
  static async createSession(
    prompt: string,
    universityId: string,
    programs: string[],
    intelligenceLevel: 'basic' | 'advanced' | 'expert',
    personaCount: number,
    templateId?: string
  ): Promise<string> {
    // Mock implementation - return a generated ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    return sessionId;
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(
    sessionId: string,
    status: GenerationSession['status'],
    errorMessage?: string
  ): Promise<void> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    // Mock implementation - do nothing
  }

  /**
   * Add generated personas to session
   */
  static async addGeneratedPersonas(
    sessionId: string,
    personaIds: string[],
    generationTimeMs: number
  ): Promise<void> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    // Mock implementation - do nothing
  }

  /**
   * Get session by ID
   */
  static async getSession(sessionId: string): Promise<GenerationSession | null> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    return null;
  }

  /**
   * Get all sessions with pagination
   */
  static async getSessions(
    limit: number = 50,
    offset: number = 0,
    universityId?: string
  ): Promise<GenerationSession[]> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    return [];
  }

  /**
   * Get session statistics
   */  
  static async getSessionStats(universityId?: string): Promise<SessionStats> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    return {
      totalSessions: 0,
      successfulSessions: 0,
      failedSessions: 0,
      totalPersonasGenerated: 0,
      averageGenerationTime: 0,
      mostUsedIntelligenceLevel: 'basic',
      mostUsedTemplate: undefined
    };
  }

  /**
   * Reuse a previous session (regenerate with same parameters)
   */
  static async reuseSession(sessionId: string): Promise<{
    prompt: string;
    universityId: string;
    programs: string[];
    intelligenceLevel: 'basic' | 'advanced' | 'expert';
    personaCount: number;
    templateId?: string;
  }> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    throw new Error('Session not found - generation_sessions table not implemented');
  }

  /**
   * Delete session and optionally its generated personas
   */
  static async deleteSession(
    sessionId: string,
    deletePersonas: boolean = false
  ): Promise<void> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    // Mock implementation - do nothing
  }

  /**
   * Get personas generated in a session
   */
  static async getSessionPersonas(sessionId: string): Promise<Persona[]> {
    console.warn('GenerationSessionService: Using mock data - generation_sessions table not implemented');
    return [];
  }
}