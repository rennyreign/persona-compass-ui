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
import { PersonaGenerationRequest } from "../../services/ai/personaGenerator";

interface AIPersonaPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (request: PersonaGenerationRequest) => void;
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

export function AIPersonaPromptDialog({ isOpen, onOpenChange, onGenerate, isGenerating = false }: AIPersonaPromptDialogProps) {
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

  const handleGenerate = () => {
    if (!selectedUniversity || selectedPrograms.length === 0 || !prompt.trim()) {
      return;
    }

    const request: PersonaGenerationRequest = {
      universityId: selectedUniversity,
      programs: selectedPrograms,
      prompt: prompt.trim(),
      count: personaCount
    };

    onGenerate(request);
  };

  const isValid = selectedUniversity && selectedPrograms.length > 0 && prompt.trim().length > 20;

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
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!isValid || isGenerating}
              className="min-w-32"
            >
              {isGenerating ? (
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
