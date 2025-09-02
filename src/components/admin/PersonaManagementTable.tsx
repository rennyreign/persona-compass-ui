import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { Search, Users, Filter, Eye, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Persona } from '@/types/persona';
import { useToast } from '@/hooks/use-toast';
import { PersonaValidationService } from '@/services/personaValidation';

interface PersonaManagementTableProps {
  onSelectionChange: (selectedPersonas: Persona[]) => void;
}

const categoryColors: Record<string, string> = {
  'Supply Chain Management': 'bg-muted/80 text-muted-foreground border border-muted',
  'Management and Leadership': 'bg-muted/60 text-muted-foreground border border-muted',  
  'Human Capital Management': 'bg-muted/40 text-muted-foreground border border-muted',
  'Healthcare Management': 'bg-muted/20 text-muted-foreground border border-muted',
  'Technology Management': 'bg-muted text-muted-foreground border border-muted',
};

export function PersonaManagementTable({ onSelectionChange }: PersonaManagementTableProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPersonas();
  }, []);

  useEffect(() => {
    const selected = personas.filter(p => selectedPersonas.has(p.id));
    onSelectionChange(selected);
  }, [selectedPersonas, personas, onSelectionChange]);

  const loadPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
      toast({
        title: "Error",
        description: "Failed to load personas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.occupation || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || persona.status === statusFilter;
    const matchesProgram = programFilter === 'all' || persona.program_category === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const uniquePrograms = Array.from(new Set(personas.map(p => p.program_category).filter(Boolean)));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPersonas(new Set(filteredPersonas.map(p => p.id)));
    } else {
      setSelectedPersonas(new Set());
    }
  };

  const handleSelectPersona = (personaId: string, checked: boolean) => {
    const newSelected = new Set(selectedPersonas);
    if (checked) {
      newSelected.add(personaId);
    } else {
      newSelected.delete(personaId);
    }
    setSelectedPersonas(newSelected);
  };

  const getCategoryBadgeClass = (category: string) => {
    return categoryColors[category] || 'bg-muted/20 text-muted-foreground border border-muted';
  };

  const getQualityGrade = (persona: Persona) => {
    try {
      return PersonaValidationService.calculateQualityScore(persona);
    } catch (error) {
      return { overall: 0.8, grade: 'B' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading personas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Persona Management
            <Badge variant="secondary" className="ml-2">{personas.length} Total</Badge>
            {selectedPersonas.size > 0 && (
              <Badge variant="default" className="ml-1">{selectedPersonas.size} Selected</Badge>
            )}
          </CardTitle>
          <Button size="sm" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate AI Personas
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Review and select personas for campaign creation. Click rows to view details.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-10 bg-card border rounded-lg p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search personas by name, role, or background..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {uniquePrograms.map(program => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredPersonas.length} of {personas.length} personas</span>
            {filteredPersonas.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Quick actions:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                >
                  Active Only
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchTerm('');
                    setProgramFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {filteredPersonas.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {personas.length === 0 ? 'No Personas Found' : 'No Results Found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {personas.length === 0 
                ? 'Generate AI personas from your programs to get started with campaign creation.'
                : 'Try adjusting your search terms or filters to find more personas.'
              }
            </p>
            <Button className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Your First Personas
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPersonas.size === filteredPersonas.length && filteredPersonas.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Persona Name + Role</TableHead>
                  <TableHead className="font-semibold">Program</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Quality</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonas.map((persona) => {
                  const qualityScore = getQualityGrade(persona);
                  const isSelected = selectedPersonas.has(persona.id);
                  
                  return (
                    <TableRow 
                      key={persona.id} 
                      className={`hover:bg-muted/25 cursor-pointer ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                      onClick={() => setSelectedPersona(persona)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectPersona(persona.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{persona.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {persona.occupation} • {persona.age_range}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={getCategoryBadgeClass(persona.program_category || '')}
                        >
                          {persona.program_category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={persona.status === 'active' ? 'default' : 'secondary'}>
                          {persona.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-foreground text-xs font-bold border ${
                            qualityScore.grade === 'A' ? 'bg-muted text-foreground border-muted-foreground/30' :
                            qualityScore.grade === 'B' ? 'bg-muted/80 text-foreground border-muted-foreground/30' :
                            qualityScore.grade === 'C' ? 'bg-muted/60 text-foreground border-muted-foreground/30' :
                            qualityScore.grade === 'D' ? 'bg-muted/40 text-foreground border-muted-foreground/30' : 'bg-muted/20 text-foreground border-muted-foreground/30'
                          }`}>
                            {qualityScore.grade}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(qualityScore.overall * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(persona.updated_at)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[600px]">
                            <SheetHeader>
                              <SheetTitle>{persona.name}</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-full mt-6">
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Demographics</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Age:</span> {persona.age_range}</p>
                                      <p><span className="font-medium">Location:</span> {persona.location}</p>
                                      <p><span className="font-medium">Occupation:</span> {persona.occupation}</p>
                                      <p><span className="font-medium">Education:</span> {persona.education_level}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Professional</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Industry:</span> {persona.industry}</p>
                                      <p><span className="font-medium">Income:</span> {persona.income_range}</p>
                                      <p><span className="font-medium">Program:</span> {persona.program_category}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Background</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {persona.description}
                                  </p>
                                </div>

                                {persona.goals && persona.goals.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Goals</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {persona.goals.map((goal, index) => (
                                        <Badge key={index} variant="outline">
                                          {goal}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {persona.pain_points && persona.pain_points.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Pain Points</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {persona.pain_points.map((point, index) => (
                                        <Badge key={index} variant="secondary">
                                          {point}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {persona.preferred_channels && persona.preferred_channels.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Preferred Channels</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {persona.preferred_channels.map((channel, index) => (
                                        <Badge key={index} variant="outline">
                                          {channel}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}