import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Trash2, Edit3, Save, X, Search, Filter } from 'lucide-react';
import { Persona } from '../../types/persona';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface BulkPersonaEditorProps {
  personas: Persona[];
  onPersonasUpdated: () => void;
}

interface BulkEditOperation {
  field: keyof Persona;
  value: any;
  operation: 'set' | 'append' | 'remove';
}

export function BulkPersonaEditor({ personas, onPersonasUpdated }: BulkPersonaEditorProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Persona>>({});
  const [bulkOperation, setBulkOperation] = useState<BulkEditOperation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter personas based on search and status
  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.program_category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || persona.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle individual persona selection
  const togglePersonaSelection = (personaId: string) => {
    const newSelection = new Set(selectedPersonas);
    if (newSelection.has(personaId)) {
      newSelection.delete(personaId);
    } else {
      newSelection.add(personaId);
    }
    setSelectedPersonas(newSelection);
  };

  // Select all filtered personas
  const selectAllFiltered = () => {
    const allIds = new Set(filteredPersonas.map(p => p.id));
    setSelectedPersonas(allIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedPersonas(new Set());
  };

  // Start editing a persona
  const startEditing = (persona: Persona) => {
    setEditingPersona(persona.id);
    setEditForm({ ...persona });
  };

  // Save individual persona edit
  const savePersonaEdit = async () => {
    if (!editingPersona || !editForm) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('personas')
        .update(editForm)
        .eq('id', editingPersona);

      if (error) throw error;

      toast({
        title: "Persona Updated",
        description: "Persona has been successfully updated.",
      });

      setEditingPersona(null);
      setEditForm({});
      onPersonasUpdated();
    } catch (error) {
      console.error('Error updating persona:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPersona(null);
    setEditForm({});
  };

  // Bulk delete selected personas
  const bulkDeletePersonas = async () => {
    if (selectedPersonas.size === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedPersonas.size} personas? This action cannot be undone.`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('personas')
        .delete()
        .in('id', Array.from(selectedPersonas));

      if (error) throw error;

      toast({
        title: "Personas Deleted",
        description: `Successfully deleted ${selectedPersonas.size} personas.`,
      });

      setSelectedPersonas(new Set());
      onPersonasUpdated();
    } catch (error) {
      console.error('Error deleting personas:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete personas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (status: string) => {
    if (selectedPersonas.size === 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('personas')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', Array.from(selectedPersonas));

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Updated status for ${selectedPersonas.size} personas.`,
      });

      setSelectedPersonas(new Set());
      onPersonasUpdated();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk update program category
  const bulkUpdateProgram = async (programCategory: string) => {
    if (selectedPersonas.size === 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('personas')
        .update({ program_category: programCategory, updated_at: new Date().toISOString() })
        .in('id', Array.from(selectedPersonas));

      if (error) throw error;

      toast({
        title: "Program Updated",
        description: `Updated program for ${selectedPersonas.size} personas.`,
      });

      setSelectedPersonas(new Set());
      onPersonasUpdated();
    } catch (error) {
      console.error('Error updating program:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Personas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Personas</Label>
              <Input
                id="search"
                placeholder="Search by name, background, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {filteredPersonas.length} of {personas.length} personas
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPersonas.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bulk Actions ({selectedPersonas.size} selected)</span>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDeletePersonas}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              
              <Select onValueChange={bulkUpdateStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Set Active</SelectItem>
                  <SelectItem value="inactive">Set Inactive</SelectItem>
                  <SelectItem value="draft">Set Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={bulkUpdateProgram}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Update Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="Supply Chain Management">Supply Chain</SelectItem>
                  <SelectItem value="Executive MBA">Executive MBA</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAllFiltered}>
            Select All ({filteredPersonas.length})
          </Button>
          {selectedPersonas.size > 0 && (
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedPersonas.size} of {filteredPersonas.length} selected
        </div>
      </div>

      {/* Personas List */}
      <div className="space-y-4">
        {filteredPersonas.map((persona) => (
          <Card key={persona.id} className={selectedPersonas.has(persona.id) ? 'ring-2 ring-primary' : ''}>
            <CardContent className="p-4">
              {editingPersona === persona.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Editing Persona</h3>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={savePersonaEdit} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age_range">Age Range</Label>
                      <Input
                        id="age_range"
                        value={editForm.age_range || ''}
                        onChange={(e) => setEditForm({ ...editForm, age_range: e.target.value })}
                        placeholder="e.g., 25-35"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program</Label>
                      <Select 
                        value={editForm.program_category || ''} 
                        onValueChange={(value) => setEditForm({ ...editForm, program_category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MBA">MBA</SelectItem>
                          <SelectItem value="Supply Chain Management">Supply Chain</SelectItem>
                          <SelectItem value="Executive MBA">Executive MBA</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedPersonas.has(persona.id)}
                    onCheckedChange={() => togglePersonaSelection(persona.id)}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{persona.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {persona.age_range} • {persona.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={persona.status === 'active' ? 'default' : 'secondary'}>
                          {persona.status}
                        </Badge>
                        <Badge variant="outline">{persona.program_category}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(persona)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm">{persona.description}</p>
                    
                    {persona.goals && persona.goals.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Goals: </span>
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(persona.goals) ? persona.goals.join(', ') : persona.goals}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPersonas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No personas found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
