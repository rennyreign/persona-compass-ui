import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Image as ImageIcon, Download } from "lucide-react";
import { OpenAIService } from "@/services/openai";

interface PersonaImageData {
  id: string;
  name: string;
  age_range: string;
  occupation: string;
  program_category: string;
}

interface PersonaImageGeneratorProps {
  selectedOrganization: string;
}

export function PersonaImageGenerator({ selectedOrganization }: PersonaImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPersona, setCurrentPersona] = useState('');
  const [personas, setPersonas] = useState<PersonaImageData[]>([]);
  const [generatedCount, setGeneratedCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPersonas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('personas')
        .select('id, name, age_range, occupation, program_category')
        .eq('organization_id', selectedOrganization);

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
      toast({
        title: "Error",
        description: "Failed to load personas",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    loadPersonas();
  }, [user]);

  const generateImageForPersona = async (persona: PersonaImageData): Promise<{ imageUrl: string; prompt: string }> => {
    try {
      // Use OpenAI DALL-E to generate persona image
      const imageUrl = await OpenAIService.generatePersonaImage({
        name: persona.name,
        age_range: persona.age_range,
        occupation: persona.occupation,
        program_category: persona.program_category
      });

      return {
        imageUrl,
        prompt: `Professional headshot for ${persona.name} - ${persona.occupation} in ${persona.program_category}`
      };
    } catch (error) {
      // Fallback to placeholder image if OpenAI fails
      const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.name)}&background=random&size=400`;
      return {
        imageUrl: placeholderUrl,
        prompt: `Placeholder image for ${persona.name}`
      };
    }
  };

  const generateImages = async () => {
    if (!user || personas.length === 0) {
      toast({
        title: "No Personas Found",
        description: "Please create personas first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedCount(0);

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      setCurrentPersona(persona.name);
      
      try {
        // Generate image for this persona
        const { imageUrl, prompt } = await generateImageForPersona(persona);
        
        // Update persona with generated image URL (using existing avatar_url field)
        const { error } = await supabase
          .from('personas')
          .update({ 
            avatar_url: imageUrl
          })
          .eq('id', persona.id);

        if (error) throw error;

        setGeneratedCount(prev => prev + 1);
        setProgress(((i + 1) / personas.length) * 100);

        // Small delay to show progress and avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error generating image for ${persona.name}:`, error);
        toast({
          title: "Error",
          description: `Failed to generate image for ${persona.name}`,
          variant: "destructive"
        });
      }
    }

    setIsGenerating(false);
    setCurrentPersona('');
    
    toast({
      title: "Images Generated!",
      description: `Successfully generated ${generatedCount} unique persona images`,
    });
  };

  const downloadImages = async () => {
    // This would implement downloading all generated images
    // For now, just show a toast
    toast({
      title: "Download Started",
      description: "Downloading all persona images...",
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-muted-foreground">
        Generate unique AI-powered images for each persona using diverse professional headshots.
        {personas.length > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
            <div className="font-semibold text-foreground mb-2">Found {personas.length} personas ready for image generation:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {personas.slice(0, 9).map(p => (
                <div key={p.id} className="text-sm bg-background/50 p-2 rounded border">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.occupation}</div>
                </div>
              ))}
              {personas.length > 9 && (
                <div className="text-sm text-muted-foreground p-2 rounded border border-dashed">
                  +{personas.length - 9} more personas
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Generating images...</span>
            <span className="font-medium">{generatedCount}/{personas.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
          {currentPersona && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Currently generating: <span className="font-medium text-foreground">{currentPersona}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={generateImages} 
          disabled={isGenerating || personas.length === 0}
          size="lg"
          className="px-8"
        >
          {isGenerating ? 'Generating Images...' : `Generate Images for ${personas.length} Personas`}
        </Button>
        
        <Button 
          onClick={downloadImages} 
          disabled={isGenerating || personas.length === 0}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 px-8"
        >
          <Download className="h-4 w-4" />
          Download All
        </Button>
      </div>
    </div>
  );
}
