import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Edit, Trash2, BookOpen, Globe, AlertCircle, Search, Filter } from "lucide-react";

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  target_audience: string;
  key_benefits: string[];
  organization_id: string;
  university_name?: string;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: string;
  name: string;
}

interface ProgramManagerProps {
  selectedOrganization: string;
}

export function ProgramManager({ selectedOrganization }: ProgramManagerProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    target_audience: '',
    key_benefits: '',
    organization_id: selectedOrganization
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPrograms();
    loadOrganizations();
  }, [selectedOrganization]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, organization_id: selectedOrganization }));
  }, [selectedOrganization]);

  const loadPrograms = async () => {
    try {
      let query = supabase
        .from('programs')
        .select(`
          *,
          organizations!inner(name)
        `)
        .order('created_at', { ascending: false });
      
      // Filter by organization if selected
      if (selectedOrganization) {
        query = query.eq('organization_id', selectedOrganization);
      }
      
      const { data, error } = await query;
      
      if (error) {
        // If table doesn't exist, use mock data temporarily
        if (error.code === '42P01') {
          console.warn('Programs table not yet created, using mock data');
          const mockPrograms: Program[] = [
            {
              id: '1',
              name: 'Supply Chain Management Certificate',
              category: 'Supply Chain Management',
              description: 'Advanced supply chain strategy, analytics, and operations management for experienced professionals',
              target_audience: 'Operations managers, procurement specialists, logistics coordinators, supply chain analysts',
              key_benefits: [
                'Strategic supply chain thinking',
                'Advanced analytics and forecasting',
                'Risk management and resilience',
                'Sustainability and ESG integration',
                'Digital transformation strategies'
              ],
              organization_id: selectedOrganization,
              university_name: 'Michigan State University',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Management and Leadership Certificate',
              category: 'Management and Leadership',
              description: 'Executive leadership development for emerging and established managers',
              target_audience: 'Team leaders, project managers, department supervisors, emerging leaders',
              key_benefits: [
                'Strategic leadership skills',
                'Team management and development',
                'Change management expertise',
                'Organizational effectiveness',
                'Executive presence and communication'
              ],
              organization_id: selectedOrganization,
              university_name: 'Michigan State University',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          
          const filteredPrograms = selectedOrganization 
            ? mockPrograms.filter(p => p.organization_id === selectedOrganization)
            : mockPrograms;
          
          setPrograms(filteredPrograms);
          return;
        }
        throw error;
      }
      
      // Transform database results to match interface
      const formattedPrograms: Program[] = (data || []).map(program => ({
        ...program,
        university_name: program.organizations?.name || 'Unknown University',
        key_benefits: Array.isArray(program.key_benefits) ? program.key_benefits : []
      }));
      
      setPrograms(formattedPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
      toast({
        title: "Error",
        description: "Failed to load programs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Program name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.category.trim()) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.organization_id) {
      toast({
        title: "Validation Error",
        description: "University selection is required",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names within the same organization
    const existingProgram = programs.find(p => 
      p.name.toLowerCase() === formData.name.toLowerCase() && 
      p.organization_id === formData.organization_id &&
      (!editingProgram || p.id !== editingProgram.id)
    );
    
    if (existingProgram) {
      toast({
        title: "Validation Error",
        description: "A program with this name already exists for this university",
        variant: "destructive"
      });
      return;
    }

    try {
      const programData = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        target_audience: formData.target_audience || null,
        key_benefits: formData.key_benefits.split('\n').filter(b => b.trim()),
        organization_id: formData.organization_id,
        created_by: user?.id
      };

      let result;
      if (editingProgram) {
        // Update existing program
        result = await supabase
          .from('programs')
          .update(programData)
          .eq('id', editingProgram.id)
          .select(`
            *,
            organizations!inner(name)
          `)
          .single();
      } else {
        // Create new program
        result = await supabase
          .from('programs')
          .insert([programData])
          .select(`
            *,
            organizations!inner(name)
          `)
          .single();
      }

      if (result.error) {
        // If table doesn't exist, fall back to mock behavior
        if (result.error.code === '42P01') {
          console.warn('Programs table not yet created, using mock implementation');
          const newProgram: Program = {
            id: editingProgram ? editingProgram.id : Date.now().toString(),
            name: formData.name,
            category: formData.category,
            description: formData.description,
            target_audience: formData.target_audience,
            key_benefits: formData.key_benefits.split('\n').filter(b => b.trim()),
            organization_id: formData.organization_id,
            university_name: organizations.find(o => o.id === formData.organization_id)?.name || 'Unknown',
            created_at: editingProgram ? editingProgram.created_at : new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          if (editingProgram) {
            setPrograms(prev => prev.map(p => p.id === editingProgram.id ? newProgram : p));
          } else {
            setPrograms(prev => [...prev, newProgram]);
          }
        } else {
          throw result.error;
        }
      } else {
        // Transform database result
        const savedProgram: Program = {
          ...result.data,
          university_name: result.data.organizations?.name || 'Unknown University',
          key_benefits: Array.isArray(result.data.key_benefits) ? result.data.key_benefits : []
        };

        if (editingProgram) {
          setPrograms(prev => prev.map(p => p.id === editingProgram.id ? savedProgram : p));
        } else {
          setPrograms(prev => [...prev, savedProgram]);
        }
      }

      toast({
        title: "Success",
        description: editingProgram ? "Program updated successfully" : "Program created successfully"
      });

      resetForm();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      category: program.category,
      description: program.description,
      target_audience: program.target_audience,
      key_benefits: program.key_benefits.join('\n'),
      organization_id: program.organization_id
    });
    setShowAddDialog(true);
  };

  const handleDelete = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (error) {
        // If table doesn't exist, use mock behavior
        if (error.code === '42P01') {
          console.warn('Programs table not yet created, using mock implementation');
          setPrograms(prev => prev.filter(p => p.id !== programId));
        } else {
          throw error;
        }
      } else {
        setPrograms(prev => prev.filter(p => p.id !== programId));
      }
      
      toast({
        title: "Success",
        description: "Program deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      target_audience: '',
      key_benefits: '',
      organization_id: selectedOrganization
    });
    setEditingProgram(null);
    setShowAddDialog(false);
  };

  // Filter programs based on search and category
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.target_audience?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || program.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(programs.map(p => p.category))).sort();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading programs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Program Management</h2>
            <p className="text-muted-foreground">Manage university programs for AI persona generation</p>
          </div>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Supply Chain Management Certificate"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Supply Chain Management"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">University *</Label>
                <Select 
                  value={formData.organization_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, organization_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the program..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Input
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                  placeholder="e.g., Operations managers, procurement specialists"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key_benefits">Key Benefits (one per line)</Label>
                <Textarea
                  id="key_benefits"
                  value={formData.key_benefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, key_benefits: e.target.value }))}
                  placeholder="Strategic supply chain thinking&#10;Advanced analytics and forecasting&#10;Risk management and resilience"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Bar */}
      {programs.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs by name, description, or target audience..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              Showing {filteredPrograms.length} of {programs.length} programs
            </div>
          </CardContent>
        </Card>
      )}

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        programs.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No programs found for the selected university. Add your first program to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No programs match your search criteria. Try adjusting your search terms or filters.
            </AlertDescription>
          </Alert>
        )
      ) : (
        <div className="grid gap-4">
          {filteredPrograms.map(program => (
            <Card key={program.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{program.category}</Badge>
                      <Badge variant="outline">{program.university_name}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(program)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {program.description && (
                  <p className="text-muted-foreground mb-3">{program.description}</p>
                )}
                {program.target_audience && (
                  <div className="mb-3">
                    <span className="font-medium text-sm">Target Audience: </span>
                    <span className="text-sm text-muted-foreground">{program.target_audience}</span>
                  </div>
                )}
                {program.key_benefits.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Key Benefits:</span>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                      {program.key_benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
