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
   */
  static async createSession(
    prompt: string,
    universityId: string,
    programs: string[],
    intelligenceLevel: 'basic' | 'advanced' | 'expert',
    personaCount: number,
    templateId?: string
  ): Promise<string> {
    const session: Partial<GenerationSession> = {
      prompt,
      university_id: universityId,
      programs,
      intelligence_level: intelligenceLevel,
      template_id: templateId,
      persona_count: personaCount,
      generated_personas: [],
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('generation_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create generation session: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(
    sessionId: string,
    status: GenerationSession['status'],
    errorMessage?: string
  ): Promise<void> {
    const updates: Partial<GenerationSession> = { status };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    if (errorMessage) {
      updates.error_message = errorMessage;
    }

    const { error } = await supabase
      .from('generation_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to update session status: ${error.message}`);
    }
  }

  /**
   * Add generated personas to session
   */
  static async addGeneratedPersonas(
    sessionId: string,
    personaIds: string[],
    generationTimeMs: number
  ): Promise<void> {
    const { error } = await supabase
      .from('generation_sessions')
      .update({
        generated_personas: personaIds,
        generation_time_ms: generationTimeMs,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to add generated personas: ${error.message}`);
    }
  }

  /**
   * Get session by ID
   */
  static async getSession(sessionId: string): Promise<GenerationSession | null> {
    const { data, error } = await supabase
      .from('generation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get session: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all sessions with pagination
   */
  static async getSessions(
    limit: number = 50,
    offset: number = 0,
    universityId?: string
  ): Promise<GenerationSession[]> {
    let query = supabase
      .from('generation_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (universityId) {
      query = query.eq('university_id', universityId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get sessions: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get session statistics
   */
  static async getSessionStats(universityId?: string): Promise<SessionStats> {
    let query = supabase
      .from('generation_sessions')
      .select('*');

    if (universityId) {
      query = query.eq('university_id', universityId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get session stats: ${error.message}`);
    }

    const sessions = data || [];
    const successfulSessions = sessions.filter(s => s.status === 'completed');
    const failedSessions = sessions.filter(s => s.status === 'failed');

    const totalPersonasGenerated = successfulSessions.reduce(
      (total, session) => total + (session.generated_personas?.length || 0),
      0
    );

    const generationTimes = successfulSessions
      .filter(s => s.generation_time_ms)
      .map(s => s.generation_time_ms!);

    const averageGenerationTime = generationTimes.length > 0
      ? generationTimes.reduce((sum, time) => sum + time, 0) / generationTimes.length
      : 0;

    // Calculate most used intelligence level
    const intelligenceLevelCounts = sessions.reduce((counts, session) => {
      const level = session.intelligence_level;
      counts[level] = (counts[level] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostUsedIntelligenceLevel = Object.entries(intelligenceLevelCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'basic';

    // Calculate most used template
    const templateCounts = sessions
      .filter(s => s.template_id)
      .reduce((counts, session) => {
        const template = session.template_id!;
        counts[template] = (counts[template] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

    const mostUsedTemplate = Object.entries(templateCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return {
      totalSessions: sessions.length,
      successfulSessions: successfulSessions.length,
      failedSessions: failedSessions.length,
      totalPersonasGenerated,
      averageGenerationTime,
      mostUsedIntelligenceLevel,
      mostUsedTemplate
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
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    return {
      prompt: session.prompt,
      universityId: session.university_id,
      programs: session.programs,
      intelligenceLevel: session.intelligence_level,
      personaCount: session.persona_count,
      templateId: session.template_id
    };
  }

  /**
   * Delete session and optionally its generated personas
   */
  static async deleteSession(
    sessionId: string,
    deletePersonas: boolean = false
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Delete generated personas if requested
    if (deletePersonas && session.generated_personas.length > 0) {
      const { error: personaError } = await supabase
        .from('personas')
        .delete()
        .in('id', session.generated_personas);

      if (personaError) {
        throw new Error(`Failed to delete personas: ${personaError.message}`);
      }
    }

    // Delete session
    const { error } = await supabase
      .from('generation_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  }

  /**
   * Get personas generated in a session
   */
  static async getSessionPersonas(sessionId: string): Promise<Persona[]> {
    const session = await this.getSession(sessionId);
    
    if (!session || !session.generated_personas.length) {
      return [];
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .in('id', session.generated_personas);

    if (error) {
      throw new Error(`Failed to get session personas: ${error.message}`);
    }

    return data || [];
  }
}
