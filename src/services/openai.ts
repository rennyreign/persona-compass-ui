// OpenAI API Integration for Image Generation
export class OpenAIService {
  private static readonly BASE_URL = 'https://api.openai.com/v1';
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static async generatePersonaImage(personaData: {
    name: string;
    age_range: string;
    occupation: string;
    program_category: string;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }

    // Create a detailed prompt for professional headshot generation
    const prompt = this.createPersonaPrompt(personaData);

    try {
      const response = await fetch(`${this.BASE_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating persona image:', error);
      throw error;
    }
  }

  private static createPersonaPrompt(personaData: {
    name: string;
    age_range: string;
    occupation: string;
    program_category: string;
  }): string {
    const ageGroup = this.getAgeDescription(personaData.age_range);
    const professionalContext = this.getProfessionalContext(personaData.occupation, personaData.program_category);

    return `Professional headshot portrait of a ${ageGroup} ${professionalContext}, 
    clean business attire, confident and approachable expression, 
    neutral professional background, high-quality photography style, 
    well-lit, corporate headshot quality, suitable for business profiles and marketing materials`;
  }

  private static getAgeDescription(ageRange: string): string {
    const ranges: Record<string, string> = {
      '18-24': 'young professional',
      '25-34': 'early-career professional',
      '35-44': 'mid-career professional',
      '45-54': 'experienced professional',
      '55-64': 'senior professional',
      '65+': 'executive-level professional'
    };
    return ranges[ageRange] || 'professional';
  }

  private static getProfessionalContext(occupation: string, programCategory: string): string {
    const contexts: Record<string, string> = {
      'Healthcare': 'healthcare professional',
      'Technology': 'technology professional',
      'Business': 'business professional',
      'Education': 'education professional',
      'Finance': 'finance professional',
      'Marketing': 'marketing professional',
      'Engineering': 'engineering professional',
      'Legal': 'legal professional'
    };

    // Try to match program category first, then occupation
    return contexts[programCategory] || contexts[occupation] || `${occupation.toLowerCase()} professional`;
  }

  static async generateCampaignCreative(campaignData: {
    title: string;
    target_audience: string;
    messaging_theme: string;
    visual_style?: string;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Create a professional marketing campaign visual for "${campaignData.title}" 
    targeting ${campaignData.target_audience}, 
    with messaging theme: ${campaignData.messaging_theme}, 
    ${campaignData.visual_style || 'modern and clean'} design style, 
    suitable for digital advertising, high-quality marketing material`;

    try {
      const response = await fetch(`${this.BASE_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating campaign creative:', error);
      throw error;
    }
  }
}
