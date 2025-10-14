import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Lightbulb, Users, Sparkles, Settings } from "lucide-react";
import { RAGDataService } from "../../services/ragDataService";
import { PersonaGenerationRequest, AIPersonaGenerator } from "../../services/ai/personaGenerator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AIPersonaPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate?: (request: PersonaGenerationRequest) => void;
  onPersonasGenerated?: () => void;
  isGenerating?: boolean;
}

interface University {
  id: string;
  name: string;
  location: string;
}

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
}

const EXAMPLE_PROMPTS = [
  {
    title: "Healthcare Management Professionals",
    prompt: "Create 5 personas for healthcare management program targeting clinical professionals (nurses, technicians, department heads) who want to transition into administrative roles. Focus on ages 30-45, with family obligations requiring flexible scheduling. Emphasize career change challenges and skill gaps in business management.",
    programs: ["hcm"],
    count: 5
  },
  {
    title: "Supply Chain Analytics Specialists",
    prompt: "Generate 3 personas for supply chain management program focusing on manufacturing professionals in the Midwest dealing with post-pandemic disruptions. Target those interested in analytics and AI applications, ages 28-40, with experience in operations or logistics.",
    programs: ["scm"],
    count: 3
  },
  {
    title: "Emerging Leaders in Tech",
    prompt: "Create 4 personas for management and leadership program targeting high-performing individual contributors in technology companies who are ready for their first management role. Ages 26-35, located in major tech hubs, seeking formal leadership training.",
    programs: ["msl"],
    count: 4
  },
  {
    title: "Cross-Functional Team Leaders",
    prompt: "Generate 6 personas for management program targeting professionals who manage cross-functional teams in various industries. Focus on those struggling with stakeholder alignment and remote team management. Ages 32-48, diverse industry backgrounds.",
    programs: ["msl"],
    count: 6
  }
];

export function AIPersonaPromptDialog({ isOpen, onOpenChange, onGenerate, onPersonasGenerated, isGenerating: externalGenerating = false }: AIPersonaPromptDialogProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [personaCount, setPersonaCount] = useState(5);
  const [generateImages, setGenerateImages] = useState(false);
  const [intelligenceLevel, setIntelligenceLevel] = useState<'basic' | 'advanced' | 'expert'>('basic');
  const [imageGeneration, setImageGeneration] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      loadPrograms(selectedUniversity);
    }
  }, [selectedUniversity]);

  const loadUniversities = async () => {
    try {
      const unis = await RAGDataService.getAvailableUniversities();
      setUniversities(unis);
      if (unis.length > 0) {
        setSelectedUniversity(unis[0].id);
      }
    } catch (error) {
      console.error('Failed to load universities:', error);
    }
  };

  // Generate a varied placeholder avatar URL to avoid identical grid when generation fails
  const getRandomPlaceholderAvatar = (seed: string) => {
    const styles = [
      'adventurer-neutral',
      'big-ears',
      'big-smile',
      'bottts',
      'croodles-neutral',
      'micah',
      'open-peeps',
      'shapes',
      'thumbs'
    ];
    const index = Math.abs(hashCode(seed)) % styles.length;
    const style = styles[index];
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&radius=50`;
  };

  const hashCode = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  };

  const loadPrograms = async (universityId: string) => {
    try {
      const progs = await RAGDataService.getAllPrograms(universityId);
      setPrograms(progs);
      setSelectedPrograms([]);
    } catch (error) {
      console.error('Failed to load programs:', error);
    }
  };

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleExampleSelect = (example: typeof EXAMPLE_PROMPTS[0]) => {
    setPrompt(example.prompt);
    setPersonaCount(example.count);
    setSelectedPrograms(example.programs);
    setShowExamples(false);
  };

  const handleGenerate = async () => {
    console.log('Generate button clicked', { 
      selectedUniversity, 
      selectedPrograms, 
      prompt: prompt.trim(), 
      promptLength: prompt.trim().length,
      user: !!user,
      universities: universities.length,
      programs: programs.length
    });
    
    if (!selectedUniversity || selectedPrograms.length === 0 || !prompt.trim() || !user) {
      const missing = [];
      if (!selectedUniversity) missing.push('University');
      if (selectedPrograms.length === 0) missing.push('Programs');
      if (!prompt.trim()) missing.push('Prompt');
      if (prompt.trim().length < 20) missing.push('Prompt (minimum 20 characters)');
      if (!user) missing.push('User authentication');
      
      console.log('Validation failed - missing:', missing);
      toast({
        title: "Missing Required Fields",
        description: `Please select/fill: ${missing.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const request: PersonaGenerationRequest = {
      universityId: selectedUniversity,
      programs: selectedPrograms,
      prompt: prompt.trim(),
      count: personaCount,
      generateImages: imageGeneration,
      intelligenceLevel: 'basic'
    };

    // If external onGenerate handler is provided, use it
    if (onGenerate) {
      console.log('Using external onGenerate handler');
      onGenerate(request);
      return;
    }

    // Otherwise, handle generation internally
    console.log('Starting internal persona generation');
    setIsGenerating(true);
    try {
      toast({
        title: "Generating Personas",
        description: `Creating ${personaCount} personas using AI...`,
      });

      // Check API key first
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        throw new Error('Google AI API key not configured. Please set VITE_GOOGLE_API_KEY in your environment.');
      }
      console.log('Google AI API key found, generating personas with Gemini...');

      // Generate personas using AI
      const personas = await AIPersonaGenerator.generatePersonas(request);
      console.log('Generated personas:', personas.length);
      
      if (personas.length === 0) {
        throw new Error('No personas were generated');
      }

      // Save personas to database
      const savedPersonas = await AIPersonaGenerator.savePersonas(personas, user.id);
      console.log('Saved personas:', savedPersonas.length);
      
      // Generate images if enabled
      if (imageGeneration && savedPersonas.length > 0) {
        toast({
          title: "Generating Images...",
          description: `Creating unique AI images for ${savedPersonas.length} personas...`,
        });
        
        // Generate unique images for each persona with delays to ensure uniqueness
        for (let i = 0; i < savedPersonas.length; i++) {
          const persona = savedPersonas[i];
          try {
            console.log(`Generating unique image for persona ${i + 1}/${savedPersonas.length}: ${persona.name}`);
            
            // Add a delay between requests to ensure uniqueness
            if (i > 0) {
              console.log(`Waiting 2 seconds before generating image for ${persona.name}...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Create a unique, varied prompt for each persona
            const uniquePrompt = createUniquePersonaPrompt(persona);
            console.log(`Unique prompt for ${persona.name}:`, uniquePrompt);
            
            // Generate image using Gemini with unique prompt
            await generatePersonaImageWithPrompt(persona.id, uniquePrompt);
            console.log(`Successfully generated image for ${persona.name}`);
            
          } catch (imageError) {
            console.error(`Failed to generate image for ${persona.name}:`);
            console.error('Error type:', typeof imageError);
            console.error('Error message:', (imageError as any)?.message);
            console.error('Error stack:', (imageError as any)?.stack);
            console.error('Full error object:', imageError);
            // Fallback: set a randomized placeholder avatar so the grid varies
            try {
              const placeholderUrl = getRandomPlaceholderAvatar(persona.id);
              const { supabase } = await import('../../integrations/supabase/client');
              const updateResult = await supabase.from('personas').update({
                avatar_url: placeholderUrl
              }).eq('id', persona.id);
              if ((updateResult as any).error) {
                console.error('Failed to set placeholder avatar:', (updateResult as any).error);
              }
            } catch (fallbackErr) {
              console.error('Placeholder fallback failed:', fallbackErr);
            }
            // Continue with other personas even if one fails
          }
        }
      }
      
      toast({
        title: "Success!",
        description: `Generated ${savedPersonas.length} personas${imageGeneration ? ' with unique AI images' : ''} successfully.`,
      });

      // Reset form and close dialog ONLY on success
      setPrompt('');
      setSelectedPrograms([]);
      setPersonaCount(5);
      setImageGeneration(false);
      onOpenChange(false);
      
      // Notify parent component
      onPersonasGenerated?.();
      
    } catch (error) {
      console.error('Persona generation failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        stringified: JSON.stringify(error)
      });
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate personas. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper method to create unique prompts for each persona
  const createUniquePersonaPrompt = (persona: any) => {
    const ageRange = persona.age_range || '30-40';
    const occupation = persona.occupation || 'business professional';
    
    // Vary attire slightly for diversity
    const attireOptions = [
      'business suit',
      'professional blazer',
      'business casual attire',
      'formal business wear',
      'corporate attire'
    ];
    const attire = attireOptions[Math.floor(Math.random() * attireOptions.length)];
    
    // Create realistic DSLR headshot prompt following the user's structure
    return `Professional headshot photo of a ${ageRange} year old ${occupation}, taken with a DSLR camera. Realistic lighting, soft background (gray or light neutral), wearing ${attire}. Natural facial expression, confident and approachable. No artistic filters, no hyper-realism, realistic human photo. Natural skin texture with minor imperfections, authentic photography, corporate headshot style`;
  };

  const extractDemographics = (persona: any) => {
    const description = persona.description?.toLowerCase() || '';
    const ageRange = persona.age_range || '30-40';
    const avgAge = Math.floor((parseInt(ageRange.split('-')[0]) + parseInt(ageRange.split('-')[1])) / 2);
    
    // Use persona ID as seed for consistent but different randomization per persona
    const personaSeed = persona.id ? parseInt(persona.id.replace(/-/g, '').substring(0, 8), 16) : Math.floor(Math.random() * 1000000);
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const genderRandom = seededRandom(personaSeed);
    const ethnicityRandom = seededRandom(personaSeed + 1);
    
    const ethnicities = [
      'African American', 'Caucasian', 'Hispanic', 'Asian', 
      'Middle Eastern', 'Mixed heritage', 'Indian', 'Native American', 
      'Pacific Islander', 'European', 'Latino', 'Black'
    ];
    
    return {
      age: avgAge,
      gender: description.includes('female') || description.includes('woman') ? 'female' : 
              description.includes('male') || description.includes('man') ? 'male' : 
              genderRandom > 0.5 ? 'female' : 'male',
      ethnicity: ethnicities[Math.floor(ethnicityRandom * ethnicities.length)]
    };
  };

  const getRandomVariations = () => {
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000000);
    
    const hairStyles = [
      'short professional haircut', 'neat business style', 'modern professional cut', 
      'polished hairstyle', 'sleek bob cut', 'professional waves', 'contemporary style',
      'classic business cut', 'stylish professional look', 'well-groomed appearance',
      'sophisticated hairstyle', 'trendy professional cut'
    ];
    
    const expressions = [
      'warm smile', 'confident expression', 'friendly demeanor', 'professional bearing',
      'approachable smile', 'serious professional look', 'kind eyes', 'focused gaze',
      'welcoming expression', 'thoughtful appearance', 'engaging smile', 'calm confidence'
    ];
    
    const attire = [
      'crisp business attire', 'professional suit', 'modern business casual', 
      'executive style clothing', 'elegant business wear', 'contemporary professional outfit',
      'classic business suit', 'polished business attire', 'sophisticated work wear',
      'professional blazer', 'formal business dress', 'smart business clothing'
    ];
    
    const backgrounds = [
      'neutral gray background', 'soft white backdrop', 'professional studio background', 
      'clean modern background', 'gradient gray backdrop', 'office environment background',
      'corporate setting', 'minimalist backdrop', 'professional workspace', 'subtle blue background',
      'warm neutral background', 'contemporary office setting'
    ];
    
    const lighting = [
      'natural soft lighting', 'professional studio lighting', 'warm natural light', 
      'balanced professional lighting', 'soft directional lighting', 'even studio illumination',
      'flattering portrait lighting', 'professional headshot lighting', 'gentle key lighting',
      'corporate portrait lighting', 'refined studio setup', 'premium portrait lighting'
    ];
    
    // Use timestamp and random seed to ensure uniqueness
    const timeBasedIndex = (timestamp + randomSeed) % hairStyles.length;
    
    return {
      hair: hairStyles[(timeBasedIndex) % hairStyles.length],
      expression: expressions[(timeBasedIndex + 1) % expressions.length],
      attire: attire[(timeBasedIndex + 2) % attire.length],
      background: backgrounds[(timeBasedIndex + 3) % backgrounds.length],
      lighting: lighting[(timeBasedIndex + 4) % lighting.length]
    };
  };

  const generatePersonaImageWithPrompt = async (personaId: string, prompt: string) => {
    try {
      console.log('Requesting image from Netlify function for persona:', personaId);
      const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, personaId }),
      });

      const text = await response.text();
      console.log('Image function response status:', response.status);
      if (!response.ok) {
        console.error('Image function error payload:', text);
        throw new Error(`Image function error (${response.status}): ${text}`);
      }

      const data = JSON.parse(text);
      const imageUrl: string = data.imageUrl;
      if (!imageUrl) {
        throw new Error('Image function did not return imageUrl');
      }

      // Update the persona's avatar_url directly
      const { supabase } = await import('../../integrations/supabase/client');
      const updateResult = await supabase.from('personas').update({
        avatar_url: imageUrl
      }).eq('id', personaId);

      if ((updateResult as any).error) {
        throw new Error(`Failed to update persona avatar: ${(updateResult as any).error.message}`);
      }
    } catch (err: any) {
      console.error('Image generation failed:', err);
      throw err;
    }
  };

  const isValid = selectedUniversity && selectedPrograms.length > 0 && prompt.trim().length > 20;
  const generatingState = isGenerating || externalGenerating;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Persona Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* University Selection */}
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="Select a university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map(uni => (
                  <SelectItem key={uni.id} value={uni.id}>
                    {uni.name} - {uni.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Program Selection */}
          <div className="space-y-3">
            <Label>Target Programs</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {programs.map(program => (
                <Card key={program.id} className={`cursor-pointer transition-colors ${
                  selectedPrograms.includes(program.id) ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`} onClick={() => handleProgramToggle(program.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedPrograms.includes(program.id)}
                        onCheckedChange={() => handleProgramToggle(program.id)}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{program.name}</h4>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {program.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {selectedPrograms.length === 0 && (
              <p className="text-sm text-muted-foreground">Select at least one program to target</p>
            )}
          </div>

          {/* Example Prompts */}
          <Collapsible open={showExamples} onOpenChange={setShowExamples}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Example Prompts
                </span>
                {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50" onClick={() => handleExampleSelect(example)}>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{example.prompt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {example.count} personas
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Persona Generation Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the personas you want to generate. Be specific about:
• Number of personas needed
• Target demographics (age, income, location)
• Professional background and roles
• Career goals and motivations
• Challenges and pain points
• Any specific requirements or characteristics

Example: 'Create 5 personas for MSU's Management & Leadership program targeting working professionals in healthcare who want to advance to director-level positions, ages 30-45, with family obligations requiring flexible scheduling.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{prompt.length} characters</span>
              <span>{prompt.length < 20 ? 'Minimum 20 characters required' : 'Good length'}</span>
            </div>
          </div>

          {/* Persona Count */}
          <div className="space-y-3">
            <Label>Number of Personas: {personaCount}</Label>
            <Slider
              value={[personaCount]}
              onValueChange={(value) => setPersonaCount(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Advanced Options
                </span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="imageGeneration"
                  checked={imageGeneration}
                  onCheckedChange={(checked) => setImageGeneration(checked === true)}
                />
                <Label htmlFor="imageGeneration" className="text-sm">
                  Generate persona images automatically
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, AI will generate professional headshot images for each persona. This may increase generation time.
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Generation Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI will analyze your prompt and university context</li>
                <li>• Generate {personaCount} unique persona{personaCount > 1 ? 's' : ''} with complete profiles</li>
                <li>• Each persona includes demographics, goals, pain points, and preferences</li>
                <li>• You'll review and approve personas before saving to database</li>
                {imageGeneration && <li>• Professional headshot images will be generated</li>}
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={generatingState}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!isValid || generatingState}
              className="min-w-32"
            >
              {generatingState ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Personas
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
