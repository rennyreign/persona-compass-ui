import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  RefreshCw, 
  User, 
  MapPin, 
  DollarSign, 
  GraduationCap,
  Target,
  AlertTriangle,
  MessageSquare,
  Heart,
  Sparkles,
  Save,
  X
} from "lucide-react";
import { Persona } from "../../types/persona";
import { PersonaValidationService, ValidationResult } from "../../services/personaValidation";

interface PersonaPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  personas: Persona[];
  onApprove: (personas: Persona[]) => void;
  onRegenerate: (index: number) => void;
  isRegenerating?: boolean;
  regeneratingIndex?: number;
}

interface PersonaEditState {
  [key: number]: Partial<Persona>;
}

export function PersonaPreviewDialog({ 
  isOpen, 
  onOpenChange, 
  personas, 
  onApprove, 
  onRegenerate,
  isRegenerating = false,
  regeneratingIndex = -1
}: PersonaPreviewDialogProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<Set<number>>(new Set(personas.map((_, i) => i)));
  const [editingPersona, setEditingPersona] = useState<number | null>(null);
  const [editState, setEditState] = useState<PersonaEditState>({});
  const [validationResults, setValidationResults] = useState<Map<number, ValidationResult>>(new Map());

  React.useEffect(() => {
    // Validate all personas when they change
    const results = new Map<number, ValidationResult>();
    personas.forEach((persona, index) => {
      const validation = PersonaValidationService.validatePersonaData(persona);
      results.set(index, validation);
    });
    setValidationResults(results);
  }, [personas]);

  const handlePersonaToggle = (index: number) => {
    const newSelected = new Set(selectedPersonas);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPersonas(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPersonas.size === personas.length) {
      setSelectedPersonas(new Set());
    } else {
      setSelectedPersonas(new Set(personas.map((_, i) => i)));
    }
  };

  const handleEditStart = (index: number) => {
    setEditingPersona(index);
    setEditState({ ...editState, [index]: { ...personas[index] } });
  };

  const handleEditSave = (index: number) => {
    const editedPersona = editState[index];
    if (editedPersona) {
      // Update the persona in the main array (this would typically update parent state)
      personas[index] = { ...personas[index], ...editedPersona };
      setEditingPersona(null);
      
      // Re-validate
      const validation = PersonaValidationService.validatePersonaData(personas[index]);
      setValidationResults(prev => new Map(prev).set(index, validation));
    }
  };

  const handleEditCancel = (index: number) => {
    setEditingPersona(null);
    const newEditState = { ...editState };
    delete newEditState[index];
    setEditState(newEditState);
  };

  const handleFieldChange = (index: number, field: keyof Persona, value: any) => {
    setEditState({
      ...editState,
      [index]: {
        ...editState[index],
        [field]: value
      }
    });
  };

  const handleApprove = () => {
    const approvedPersonas = personas.filter((_, index) => selectedPersonas.has(index));
    onApprove(approvedPersonas);
  };

  const getPersonaToDisplay = (index: number): Persona => {
    return editingPersona === index && editState[index] 
      ? { ...personas[index], ...editState[index] } 
      : personas[index];
  };

  const getQualityScore = (index: number): number => {
    const validation = validationResults.get(index);
    return validation?.score || 0;
  };

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Review Generated Personas ({personas.length})
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedPersonas.size === personas.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Badge variant="secondary">
                {selectedPersonas.size} selected
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="grid" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                  {personas.map((persona, index) => {
                    const displayPersona = getPersonaToDisplay(index);
                    const validation = validationResults.get(index);
                    const qualityScore = getQualityScore(index);
                    const isSelected = selectedPersonas.has(index);
                    const isEditing = editingPersona === index;
                    const isRegeneratingThis = regeneratingIndex === index && isRegenerating;

                    return (
                      <Card 
                        key={index} 
                        className={`relative transition-all ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                        } ${isRegeneratingThis ? 'opacity-50' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handlePersonaToggle(index)}
                                  className="rounded"
                                />
                                {isEditing ? (
                                  <Input
                                    value={editState[index]?.name || displayPersona.name}
                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                    className="text-lg font-semibold"
                                  />
                                ) : (
                                  displayPersona.name
                                )}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {displayPersona.program_category}
                                </Badge>
                                <Badge 
                                  variant={qualityScore >= 90 ? 'default' : qualityScore >= 70 ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {qualityScore}% Quality
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {!isEditing ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditStart(index)}
                                    disabled={isRegeneratingThis}
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRegenerate(index)}
                                    disabled={isRegenerating}
                                  >
                                    {isRegeneratingThis ? (
                                      <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                    ) : (
                                      <RefreshCw className="h-3 w-3" />
                                    )}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditSave(index)}
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCancel(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Age:</span>
                              <span>{displayPersona.age_range}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Income:</span>
                              <span>{displayPersona.income_range}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Location:</span>
                              <span className="truncate">{displayPersona.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Education:</span>
                              <span className="truncate">{displayPersona.education_level}</span>
                            </div>
                          </div>

                          {isEditing ? (
                            <Textarea
                              value={editState[index]?.description || displayPersona.description}
                              onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {displayPersona.description}
                            </p>
                          )}

                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Target className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium">Goals</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {displayPersona.goals?.slice(0, 2).map((goal, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {goal}
                                  </Badge>
                                ))}
                                {displayPersona.goals && displayPersona.goals.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{displayPersona.goals.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <AlertTriangle className="h-3 w-3 text-orange-600" />
                                <span className="text-xs font-medium">Pain Points</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {displayPersona.pain_points?.slice(0, 2).map((pain, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {pain}
                                  </Badge>
                                ))}
                                {displayPersona.pain_points && displayPersona.pain_points.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{displayPersona.pain_points.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {validation && validation.warnings.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                              <div className="flex items-center gap-1 mb-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                <span className="text-xs font-medium text-yellow-800">Quality Warnings</span>
                              </div>
                              <ul className="text-xs text-yellow-700 space-y-1">
                                {validation.warnings.slice(0, 2).map((warning, i) => (
                                  <li key={i}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="detailed" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6 p-1">
                  {personas.map((persona, index) => {
                    const displayPersona = getPersonaToDisplay(index);
                    const validation = validationResults.get(index);
                    const qualityScore = getQualityScore(index);
                    const isSelected = selectedPersonas.has(index);

                    return (
                      <Card key={index} className={`${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handlePersonaToggle(index)}
                                className="rounded"
                              />
                              <div>
                                <CardTitle className="text-xl">{displayPersona.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{displayPersona.program_category}</Badge>
                                  <Badge variant="secondary">Quality: {qualityScore}%</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditStart(index)}>
                                <Edit3 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => onRegenerate(index)}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Regenerate
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Age Range</Label>
                              <p className="text-sm">{displayPersona.age_range}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Occupation</Label>
                              <p className="text-sm">{displayPersona.occupation}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Income</Label>
                              <p className="text-sm">{displayPersona.income_range}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Location</Label>
                              <p className="text-sm">{displayPersona.location}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="text-sm text-muted-foreground mt-1">{displayPersona.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                Goals
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayPersona.goals?.map((goal, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {goal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Pain Points
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayPersona.pain_points?.map((pain, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {pain}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Personality Traits
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayPersona.personality_traits?.map((trait, i) => (
                                  <Badge key={i} variant="default" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                Values
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {displayPersona.values?.map((value, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
                            <div className="space-y-2">
                              {validation.errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="font-medium text-red-800">Validation Errors</span>
                                  </div>
                                  <ul className="text-sm text-red-700 space-y-1">
                                    {validation.errors.map((error, i) => (
                                      <li key={i}>• {error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {validation.warnings.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <span className="font-medium text-yellow-800">Quality Warnings</span>
                                  </div>
                                  <ul className="text-sm text-yellow-700 space-y-1">
                                    {validation.warnings.map((warning, i) => (
                                      <li key={i}>• {warning}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {selectedPersonas.size} of {personas.length} personas selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove} 
              disabled={selectedPersonas.size === 0}
              className="min-w-32"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Save ({selectedPersonas.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
