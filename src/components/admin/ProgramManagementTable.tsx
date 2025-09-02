import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, ChevronRight, Building, Plus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProgramManager } from './ProgramManager';
import { ProgramDataImporter } from './ProgramDataImporter';

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  target_audience: string;
  key_benefits: string[];
  created_at: string;
  updated_at: string;
}

interface ProgramManagementTableProps {
  selectedOrganization: string;
  onPersonaCountChange?: (programId: string, count: number) => void;
}

const categoryColors: Record<string, string> = {
  'Supply Chain Management': 'bg-green-100 text-green-800 border-green-200',
  'Management and Leadership': 'bg-purple-100 text-purple-800 border-purple-200',  
  'Human Capital Management': 'bg-blue-100 text-blue-800 border-blue-200',
  'Healthcare Management': 'bg-red-100 text-red-800 border-red-200',
  'Technology Management': 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export function ProgramManagementTable({ selectedOrganization, onPersonaCountChange }: ProgramManagementTableProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [personaCounts, setPersonaCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showProgramManager, setShowProgramManager] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedOrganization) {
      loadPrograms();
      loadPersonaCounts();
    }
  }, [selectedOrganization]);

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('organization_id', selectedOrganization)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast({
        title: "Error",
        description: "Failed to load programs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersonaCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('program_category')
        .eq('organization_id', selectedOrganization);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(persona => {
        const category = persona.program_category || 'Unknown';
        counts[category] = (counts[category] || 0) + 1;
      });

      setPersonaCounts(counts);
      
      // Notify parent component of persona counts
      Object.entries(counts).forEach(([category, count]) => {
        onPersonaCountChange?.(category, count);
      });
    } catch (error) {
      console.error('Error loading persona counts:', error);
    }
  };

  const toggleRow = (programId: string) => {
    const newExpanded = new Set(expandedRows);
    if (expandedRows.has(programId)) {
      newExpanded.delete(programId);
    } else {
      newExpanded.add(programId);
    }
    setExpandedRows(newExpanded);
  };

  const getCategoryBadgeClass = (category: string) => {
    return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Program Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading programs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Program Management
            <Badge variant="secondary" className="ml-2">{programs.length} Programs</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <ProgramDataImporter 
              selectedOrganization={selectedOrganization}
              onImportComplete={loadPrograms}
            />
            <Button size="sm" className="flex items-center gap-2" onClick={() => setShowProgramManager(true)}>
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Define program inputs that drive persona generation and campaign targeting
        </p>
      </CardHeader>
      <CardContent>
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Programs Found</h3>
            <p className="text-muted-foreground">
              Create programs to define target audiences and generate relevant personas.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-8"></TableHead>
                  <TableHead className="font-semibold">Program Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Target Audience</TableHead>
                  <TableHead className="font-semibold text-center">Linked Personas</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <React.Fragment key={program.id}>
                    <TableRow className="hover:bg-muted/25">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(program.id)}
                          className="p-1 h-6 w-6"
                        >
                          {expandedRows.has(program.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getCategoryBadgeClass(program.category)}
                        >
                          {program.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {program.target_audience}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {personaCounts[program.category] || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(program.updated_at)}
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(program.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/10 p-0">
                          <div className="p-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {program.description}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Key Benefits</h4>
                                <ul className="space-y-1">
                                  {program.key_benefits?.map((benefit, index) => (
                                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                                      <span className="text-primary mr-2">•</span>
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Program Manager Dialog */}
      {showProgramManager && (
        <ProgramManager 
          selectedOrganization={selectedOrganization}
          onClose={() => {
            setShowProgramManager(false);
            loadPrograms(); // Refresh programs after adding
          }}
        />
      )}
    </Card>
  );
}