export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  intelligenceLevel: 'basic' | 'advanced' | 'expert';
  suggestedCount: number;
  targetPrograms: string[];
}

export class PromptTemplateService {
  private static templates: PromptTemplate[] = [
    // Basic Templates
    {
      id: 'career-changers-basic',
      name: 'Career Changers',
      description: 'Professionals seeking to transition to new industries',
      category: 'Career Transition',
      template: 'Generate {count} personas for professionals looking to change careers into {programs}. Focus on ages 28-45, various industry backgrounds, motivated by career growth and stability. Include financial considerations and time constraints.',
      intelligenceLevel: 'basic',
      suggestedCount: 5,
      targetPrograms: ['mba', 'msl', 'supply-chain']
    },
    {
      id: 'working-professionals-basic',
      name: 'Working Professionals',
      description: 'Current professionals seeking advancement',
      category: 'Career Advancement',
      template: 'Create {count} personas for working professionals seeking to advance in {programs}. Ages 30-50, currently employed, looking for leadership skills and strategic thinking. Consider work-life balance and employer support.',
      intelligenceLevel: 'basic',
      suggestedCount: 6,
      targetPrograms: ['mba', 'executive-mba', 'leadership']
    },
    {
      id: 'recent-graduates-basic',
      name: 'Recent Graduates',
      description: 'New graduates entering the workforce',
      category: 'Early Career',
      template: 'Generate {count} personas for recent graduates interested in {programs}. Ages 22-28, limited work experience, seeking skill development and career foundation. Focus on entry-level concerns and growth potential.',
      intelligenceLevel: 'basic',
      suggestedCount: 4,
      targetPrograms: ['masters', 'certificate', 'professional-development']
    },

    // Advanced Templates
    {
      id: 'executives-advanced',
      name: 'Executive Leaders',
      description: 'Senior executives and C-suite professionals',
      category: 'Executive Education',
      template: 'Create {count} sophisticated personas for senior executives considering {programs}. Focus on strategic leadership challenges, board-level decision making, and organizational transformation. Ages 40-60, $200k+ compensation, managing large teams and budgets.',
      intelligenceLevel: 'advanced',
      suggestedCount: 4,
      targetPrograms: ['executive-mba', 'executive-education', 'leadership']
    },
    {
      id: 'entrepreneurs-advanced',
      name: 'Entrepreneurs & Founders',
      description: 'Business owners and startup founders',
      category: 'Entrepreneurship',
      template: 'Generate {count} personas for entrepreneurs and business founders interested in {programs}. Include scaling challenges, funding considerations, and market expansion goals. Vary business stages from startup to established companies.',
      intelligenceLevel: 'advanced',
      suggestedCount: 5,
      targetPrograms: ['mba', 'entrepreneurship', 'innovation']
    },
    {
      id: 'industry-specialists-advanced',
      name: 'Industry Specialists',
      description: 'Deep domain experts seeking broader skills',
      category: 'Specialization',
      template: 'Create {count} personas for industry specialists in {programs}. Focus on technical experts seeking business acumen, regulatory professionals needing strategic skills, or specialists wanting to transition to management roles.',
      intelligenceLevel: 'advanced',
      suggestedCount: 6,
      targetPrograms: ['mba', 'supply-chain', 'healthcare-management']
    },

    // Expert Templates
    {
      id: 'global-leaders-expert',
      name: 'Global Business Leaders',
      description: 'International executives with complex challenges',
      category: 'Global Leadership',
      template: 'Generate {count} expert-level personas for global business leaders considering {programs}. Include cross-cultural management, international market expansion, geopolitical considerations, and complex stakeholder management. Focus on Fortune 500 or equivalent international companies.',
      intelligenceLevel: 'expert',
      suggestedCount: 3,
      targetPrograms: ['executive-mba', 'global-mba', 'international-business']
    },
    {
      id: 'transformation-leaders-expert',
      name: 'Transformation Leaders',
      description: 'Leaders driving organizational change',
      category: 'Transformation',
      template: 'Create {count} expert personas for transformation leaders in {programs}. Focus on digital transformation, cultural change, merger integration, or turnaround situations. Include change management complexity, stakeholder resistance, and performance measurement challenges.',
      intelligenceLevel: 'expert',
      suggestedCount: 4,
      targetPrograms: ['executive-mba', 'change-management', 'strategy']
    }
  ];

  /**
   * Get all available templates
   */
  static getAllTemplates(): PromptTemplate[] {
    return [...this.templates];
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  /**
   * Get templates by intelligence level
   */
  static getTemplatesByLevel(level: 'basic' | 'advanced' | 'expert'): PromptTemplate[] {
    return this.templates.filter(template => template.intelligenceLevel === level);
  }

  /**
   * Get template by ID
   */
  static getTemplateById(id: string): PromptTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  /**
   * Get templates suitable for specific programs
   */
  static getTemplatesForPrograms(programs: string[]): PromptTemplate[] {
    return this.templates.filter(template => 
      template.targetPrograms.some(program => 
        programs.some(p => p.toLowerCase().includes(program.toLowerCase()))
      )
    );
  }

  /**
   * Generate prompt from template
   */
  static generatePrompt(templateId: string, count: number, programs: string[]): string {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    return template.template
      .replace('{count}', count.toString())
      .replace('{programs}', programs.join(', '));
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    const categories = new Set(this.templates.map(t => t.category));
    return Array.from(categories).sort();
  }

  /**
   * Search templates by keyword
   */
  static searchTemplates(keyword: string): PromptTemplate[] {
    const searchTerm = keyword.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm) ||
      template.template.toLowerCase().includes(searchTerm)
    );
  }
}
