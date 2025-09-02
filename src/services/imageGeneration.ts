interface PersonaImageRequest {
  name: string;
  age_range: string;
  occupation: string;
  program_category: string;
  personality_traits?: string[];
}

interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
}

export class PersonaImageService {
  private static readonly DIVERSE_CHARACTERISTICS = {
    genders: ['man', 'woman'],
    ethnicities: [
      'Caucasian', 'African American', 'Hispanic/Latino', 'Asian', 
      'Middle Eastern', 'Native American', 'Mixed ethnicity'
    ],
    hairStyles: [
      'short professional hair', 'shoulder-length hair', 'curly hair',
      'straight hair', 'wavy hair', 'styled hair'
    ],
    attire: [
      'navy business suit', 'charcoal suit', 'professional blazer',
      'button-down shirt', 'professional dress', 'business casual'
    ]
  };

  private static getAgeDescription(ageRange: string): string {
    const startAge = parseInt(ageRange.split('-')[0]);
    if (startAge < 28) return 'young professional in their mid-20s';
    if (startAge < 35) return 'professional in their early 30s';
    if (startAge < 42) return 'experienced professional in their late 30s';
    return 'seasoned professional in their 40s';
  }

  private static generateDiverseCharacteristics(personaName: string) {
    // Use persona name as seed for consistent but diverse results
    const seed = personaName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const gender = this.DIVERSE_CHARACTERISTICS.genders[seed % this.DIVERSE_CHARACTERISTICS.genders.length];
    const ethnicity = this.DIVERSE_CHARACTERISTICS.ethnicities[Math.floor(seed / 2) % this.DIVERSE_CHARACTERISTICS.ethnicities.length];
    const hairStyle = this.DIVERSE_CHARACTERISTICS.hairStyles[Math.floor(seed / 3) % this.DIVERSE_CHARACTERISTICS.hairStyles.length];
    const attire = this.DIVERSE_CHARACTERISTICS.attire[Math.floor(seed / 4) % this.DIVERSE_CHARACTERISTICS.attire.length];

    return { gender, ethnicity, hairStyle, attire };
  }

  static generatePrompt(persona: PersonaImageRequest): string {
    const ageDesc = this.getAgeDescription(persona.age_range);
    const { gender, ethnicity, hairStyle, attire } = this.generateDiverseCharacteristics(persona.name);

    const basePrompt = `Professional corporate headshot of a ${ageDesc} ${ethnicity} ${gender} working as a ${persona.occupation}`;
    const stylePrompt = `${hairStyle}, wearing ${attire}, confident warm smile, looking directly at camera`;
    const qualityPrompt = `clean modern office background, professional studio lighting, high resolution, corporate photography style, LinkedIn profile quality`;

    return `${basePrompt}, ${stylePrompt}, ${qualityPrompt}`;
  }

  static async generateWithOpenAI(prompt: string): Promise<string> {
    const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using placeholder image');
      return this.generatePlaceholderImage(prompt);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      return this.generatePlaceholderImage(prompt);
    }
  }

  private static generatePlaceholderImage(prompt: string): string {
    // Generate a unique seed based on the prompt
    const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Use different placeholder services for variety
    const services = [
      `https://picsum.photos/seed/${seed}/400/400`,
      `https://source.unsplash.com/400x400/?professional,business,portrait&sig=${seed}`,
      `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80&sig=${seed}`,
    ];

    return services[seed % services.length];
  }

  static async generatePersonaImage(persona: PersonaImageRequest): Promise<ImageGenerationResponse> {
    const prompt = this.generatePrompt(persona);
    const imageUrl = await this.generateWithOpenAI(prompt);
    
    return {
      imageUrl,
      prompt
    };
  }
}

// Predefined professional images for immediate use
export const PROFESSIONAL_HEADSHOTS = {
  'Sarah Chen': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Marcus Rodriguez': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Jennifer Park': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'David Kim': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Amanda Thompson': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Robert Martinez': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Lisa Wang': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Michael Johnson': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Rachel Foster': 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Carlos Rivera': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'Patricia Adams': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
  'James Mitchell': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
};
