import { supabase } from '@/integrations/supabase/client';

export interface ProgramDataSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'manual';
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  rateLimit?: number; // requests per minute
}

export interface RawProgramData {
  name: string;
  category: string;
  description: string;
  targetAudience: string;
  keyBenefits: string[];
  duration?: string;
  format?: string;
  prerequisites?: string[];
  tuition?: string;
  credits?: number;
  sourceUrl?: string;
}

export interface ProgramImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  programs: RawProgramData[];
}

export class ProgramDataAutomationService {
  private static readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests
  private static readonly MAX_RETRIES = 3;

  /**
   * Import programs from multiple data sources
   */
  static async importProgramsForOrganization(
    organizationId: string,
    sources: ProgramDataSource[]
  ): Promise<ProgramImportResult> {
    const allPrograms: RawProgramData[] = [];
    const errors: string[] = [];
    let imported = 0;
    let skipped = 0;

    for (const source of sources) {
      try {
        console.log(`Importing from source: ${source.name}`);
        const programs = await this.fetchProgramsFromSource(source);
        allPrograms.push(...programs);
      } catch (error) {
        console.error(`Failed to import from ${source.name}:`, error);
        errors.push(`${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Process and save programs to database
    for (const program of allPrograms) {
      try {
        const saved = await this.saveProgramToDatabase(program, organizationId);
        if (saved) {
          imported++;
        } else {
          skipped++;
        }
      } catch (error) {
        console.error('Failed to save program:', error);
        errors.push(`Save error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        skipped++;
      }
    }

    return {
      success: errors.length === 0,
      imported,
      skipped,
      errors,
      programs: allPrograms
    };
  }

  /**
   * Fetch programs from a specific data source
   */
  private static async fetchProgramsFromSource(source: ProgramDataSource): Promise<RawProgramData[]> {
    switch (source.type) {
      case 'api':
        return this.fetchFromAPI(source);
      case 'scraper':
        return this.fetchFromScraper(source);
      case 'manual':
        return this.fetchFromManualSource(source);
      default:
        throw new Error(`Unsupported source type: ${source.type}`);
    }
  }

  /**
   * Fetch programs from API endpoints
   */
  private static async fetchFromAPI(source: ProgramDataSource): Promise<RawProgramData[]> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'PersonaCompass/1.0',
      ...source.headers
    };

    if (source.apiKey) {
      headers['Authorization'] = `Bearer ${source.apiKey}`;
    }

    let retries = 0;
    while (retries < this.MAX_RETRIES) {
      try {
        const response = await fetch(source.baseUrl, {
          method: 'GET',
          headers
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return this.parseAPIResponse(data, source);
      } catch (error) {
        retries++;
        if (retries >= this.MAX_RETRIES) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    return [];
  }

  /**
   * Parse API response into standardized program data
   */
  private static parseAPIResponse(data: any, source: ProgramDataSource): RawProgramData[] {
    const programs: RawProgramData[] = [];

    // Handle different API response formats
    const items = Array.isArray(data) ? data : data.results || data.programs || data.data || [];

    for (const item of items) {
      try {
        const program: RawProgramData = {
          name: item.name || item.title || item.program_name || 'Unknown Program',
          category: this.categorizeProgram(item.category || item.field || item.department || ''),
          description: item.description || item.summary || item.overview || '',
          targetAudience: item.target_audience || item.audience || 'Professionals',
          keyBenefits: this.extractBenefits(item.benefits || item.outcomes || item.skills || []),
          duration: item.duration || item.length || undefined,
          format: item.format || item.delivery_method || undefined,
          prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : [],
          tuition: item.tuition || item.cost || undefined,
          credits: item.credits || item.credit_hours || undefined,
          sourceUrl: item.url || item.link || source.baseUrl
        };

        programs.push(program);
      } catch (error) {
        console.warn('Failed to parse program item:', item, error);
      }
    }

    return programs;
  }

  /**
   * Fetch programs using web scraping (placeholder - would use Puppeteer/Playwright)
   */
  private static async fetchFromScraper(source: ProgramDataSource): Promise<RawProgramData[]> {
    // This would implement web scraping logic
    // For now, return empty array as scraping requires additional setup
    console.warn(`Scraping not implemented for ${source.name}. Consider using API or manual import.`);
    return [];
  }

  /**
   * Fetch programs from manual/CSV sources
   */
  private static async fetchFromManualSource(source: ProgramDataSource): Promise<RawProgramData[]> {
    // This would handle CSV/Excel file imports
    // For now, return predefined MSU programs
    return this.getMSUProgramData();
  }

  /**
   * Get predefined MSU program data
   */
  private static getMSUProgramData(): RawProgramData[] {
    return [
      {
        name: 'Master of Science in Supply Chain Management',
        category: 'Supply Chain Management',
        description: 'Advanced supply chain strategy, analytics, and operations management for experienced professionals.',
        targetAudience: 'Operations and logistics professionals with 3+ years experience',
        keyBenefits: [
          'Strategic supply chain thinking',
          'Advanced analytics and data science',
          'Leadership and team management',
          'Global supply chain expertise',
          'Risk management and sustainability'
        ],
        duration: '18 months',
        format: 'Hybrid (online + residencies)',
        prerequisites: ['Bachelor\'s degree', '3+ years work experience'],
        sourceUrl: 'https://broad.msu.edu/masters/supply-chain-management/'
      },
      {
        name: 'Master of Management',
        category: 'Management and Leadership',
        description: 'Executive leadership development program for emerging and established leaders.',
        targetAudience: 'Mid-level managers and emerging executives',
        keyBenefits: [
          'Executive leadership skills',
          'Strategic decision making',
          'Team and organizational management',
          'Change management expertise',
          'Cross-functional collaboration'
        ],
        duration: '12-15 months',
        format: 'Executive (weekends + online)',
        prerequisites: ['Bachelor\'s degree', '5+ years management experience'],
        sourceUrl: 'https://broad.msu.edu/masters/management/'
      },
      {
        name: 'Master of Human Resources and Labor Relations',
        category: 'Human Capital Management',
        description: 'Strategic HR management, talent development, and organizational psychology.',
        targetAudience: 'HR professionals and people managers',
        keyBenefits: [
          'Strategic HR planning',
          'Talent acquisition and development',
          'Organizational design and culture',
          'Labor relations and compliance',
          'Data-driven HR analytics'
        ],
        duration: '24 months',
        format: 'Online with optional residencies',
        prerequisites: ['Bachelor\'s degree', 'HR or management experience preferred'],
        sourceUrl: 'https://broad.msu.edu/masters/human-resources/'
      },
      {
        name: 'Master of Science in Marketing Research',
        category: 'Marketing and Analytics',
        description: 'Advanced marketing analytics, consumer behavior, and market research methodologies.',
        targetAudience: 'Marketing professionals and data analysts',
        keyBenefits: [
          'Advanced marketing analytics',
          'Consumer behavior insights',
          'Market research design',
          'Data visualization and reporting',
          'Strategic marketing planning'
        ],
        duration: '18 months',
        format: 'Hybrid (online + campus)',
        prerequisites: ['Bachelor\'s degree', 'Basic statistics knowledge'],
        sourceUrl: 'https://broad.msu.edu/masters/marketing-research/'
      }
    ];
  }

  /**
   * Categorize program into standard categories
   */
  private static categorizeProgram(rawCategory: string): string {
    const categoryMap: Record<string, string> = {
      'supply chain': 'Supply Chain Management',
      'logistics': 'Supply Chain Management',
      'operations': 'Supply Chain Management',
      'management': 'Management and Leadership',
      'leadership': 'Management and Leadership',
      'executive': 'Management and Leadership',
      'mba': 'Management and Leadership',
      'hr': 'Human Capital Management',
      'human resources': 'Human Capital Management',
      'people': 'Human Capital Management',
      'talent': 'Human Capital Management',
      'marketing': 'Marketing and Analytics',
      'analytics': 'Marketing and Analytics',
      'data science': 'Technology Management',
      'technology': 'Technology Management',
      'it': 'Technology Management',
      'healthcare': 'Healthcare Management',
      'health': 'Healthcare Management',
      'finance': 'Finance and Accounting',
      'accounting': 'Finance and Accounting'
    };

    const normalized = rawCategory.toLowerCase();
    for (const [key, category] of Object.entries(categoryMap)) {
      if (normalized.includes(key)) {
        return category;
      }
    }

    return 'Professional Development';
  }

  /**
   * Extract and standardize program benefits
   */
  private static extractBenefits(rawBenefits: any): string[] {
    if (Array.isArray(rawBenefits)) {
      return rawBenefits.filter(b => typeof b === 'string' && b.length > 0);
    }
    
    if (typeof rawBenefits === 'string') {
      return rawBenefits.split(',').map(b => b.trim()).filter(b => b.length > 0);
    }

    return ['Career advancement', 'Skill development', 'Professional networking'];
  }

  /**
   * Save program to database
   */
  private static async saveProgramToDatabase(
    program: RawProgramData, 
    organizationId: string
  ): Promise<boolean> {
    try {
      // Check if program already exists
      const { data: existing } = await supabase
        .from('programs')
        .select('id')
        .eq('name', program.name)
        .eq('organization_id', organizationId)
        .single();

      if (existing) {
        console.log(`Program already exists: ${program.name}`);
        return false; // Skip existing programs
      }

      // Insert new program
      const { error } = await supabase
        .from('programs')
        .insert({
          name: program.name,
          category: program.category,
          description: program.description,
          target_audience: program.targetAudience,
          key_benefits: program.keyBenefits,
          organization_id: organizationId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      console.log(`Saved program: ${program.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to save program ${program.name}:`, error);
      throw error;
    }
  }

  /**
   * Get available data sources for program import
   */
  static getAvailableDataSources(): ProgramDataSource[] {
    return [
      {
        id: 'msu-manual',
        name: 'Michigan State University (Manual)',
        type: 'manual',
        baseUrl: 'https://broad.msu.edu',
        rateLimit: 60
      },
      {
        id: 'college-scorecard',
        name: 'College Scorecard API',
        type: 'api',
        baseUrl: 'https://api.data.gov/ed/collegescorecard/v1/schools',
        headers: {
          'X-API-Key': 'DEMO_KEY' // Would use real API key
        },
        rateLimit: 1000
      }
      // Add more data sources as needed
    ];
  }

  /**
   * Validate program data before import
   */
  static validateProgramData(program: RawProgramData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!program.name || program.name.trim().length === 0) {
      errors.push('Program name is required');
    }

    if (!program.category || program.category.trim().length === 0) {
      errors.push('Program category is required');
    }

    if (!program.description || program.description.trim().length < 10) {
      errors.push('Program description must be at least 10 characters');
    }

    if (!program.targetAudience || program.targetAudience.trim().length === 0) {
      errors.push('Target audience is required');
    }

    if (!Array.isArray(program.keyBenefits) || program.keyBenefits.length === 0) {
      errors.push('At least one key benefit is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
