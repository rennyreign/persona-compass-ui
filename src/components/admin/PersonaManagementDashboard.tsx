import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, BarChart3, Users, TrendingUp, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Persona } from '@/types/persona';
import { AIPersonaPromptDialog } from './AIPersonaPromptDialog';
import { BulkPersonaEditor } from './BulkPersonaEditor';
import { useToast } from '@/hooks/use-toast';
import { PersonaValidationService } from '@/services/ai/personaValidationService';

interface PersonaStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  byProgram: Record<string, number>;
  recentlyCreated: number;
}

export function PersonaManagementDashboard() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [stats, setStats] = useState<PersonaStats>({
    total: 0,
    active: 0,
    inactive: 0,
    draft: 0,
    byProgram: {},
    recentlyCreated: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPersonas(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
      toast({
        title: "Error",
        description: "Failed to load personas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (personaData: Persona[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: PersonaStats = {
      total: personaData.length,
      active: personaData.filter(p => p.status === 'active').length,
      inactive: personaData.filter(p => p.status === 'inactive').length,
      draft: personaData.filter(p => p.status === 'draft').length,
      byProgram: {},
      recentlyCreated: personaData.filter(p => new Date(p.created_at) > oneWeekAgo).length
    };

    // Calculate by program
    personaData.forEach(persona => {
      const program = persona.program_category || 'Unknown';
      stats.byProgram[program] = (stats.byProgram[program] || 0) + 1;
    });

    setStats(stats);
  };

  const handleAIGeneration = async (request: any) => {
    setIsGenerating(true);
    try {
      // For now, show a message that AI generation is not yet implemented
      toast({
        title: "AI Generation",
        description: "AI persona generation will be implemented soon. Please use the bulk editor for now.",
        variant: "default",
      });

      setShowAIDialog(false);
    } catch (error) {
      console.error('Error generating personas:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate personas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter personas based on search and filters
  const filteredPersonas = personas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (persona.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProgram = selectedProgram === 'all' || persona.program_category === selectedProgram;
    const matchesStatus = selectedStatus === 'all' || persona.status === selectedStatus;
    
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const getQualityBadgeColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.7) return 'bg-yellow-500';
    if (score >= 0.6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Persona Management</h1>
          <p className="text-muted-foreground">
            Manage and analyze your AI-generated personas
          </p>
        </div>
        <Button onClick={() => setShowAIDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate AI Personas
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentlyCreated} created this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Personas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.active / stats.total) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byProgram).length}</div>
            <p className="text-xs text-muted-foreground">
              Different program categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Personas</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search personas by name or background..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {Object.keys(stats.byProgram).map(program => (
                  <SelectItem key={program} value={program}>
                    {program} ({stats.byProgram[program]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active ({stats.active})</SelectItem>
                <SelectItem value="inactive">Inactive ({stats.inactive})</SelectItem>
                <SelectItem value="draft">Draft ({stats.draft})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredPersonas.length} of {stats.total} personas
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bulk-edit">Bulk Edit</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Personas Grid */}
          <div className="grid gap-4">
            {filteredPersonas.map((persona) => {
              // Safe quality score calculation with fallback
              let qualityScore = { overall: 0.8, grade: 'B' };
              try {
                qualityScore = PersonaValidationService.calculateQualityScore(persona);
              } catch (error) {
                console.warn('Quality score calculation failed:', error);
              }
              
              return (
                <Card key={persona.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{persona.name}</h3>
                          <Badge variant={persona.status === 'active' ? 'default' : 'secondary'}>
                            {persona.status}
                          </Badge>
                          <Badge variant="outline">{persona.program_category}</Badge>
                          <div className={`w-6 h-6 rounded-full ${getQualityBadgeColor(qualityScore.overall)} flex items-center justify-center text-white text-xs font-bold`}>
                            {qualityScore.grade}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {persona.location || 'Location not specified'}
                        </p>
                        <p className="text-sm">{persona.description || 'No description available'}</p>
                        
                        {persona.goals && persona.goals.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(persona.goals) ? persona.goals : [persona.goals]).slice(0, 3).map((goal, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Created {new Date(persona.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPersonas.length === 0 && !isLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No personas found matching your criteria.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowAIDialog(true)}
                >
                  Generate Your First Personas
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bulk-edit">
          <BulkPersonaEditor 
            personas={filteredPersonas} 
            onPersonasUpdated={loadPersonas}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Program Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Program Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.byProgram).map(([program, count]) => (
                    <div key={program} className="flex justify-between items-center">
                      <span className="text-sm">{program}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active</span>
                    <Badge className="bg-green-500">{stats.active}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inactive</span>
                    <Badge variant="secondary">{stats.inactive}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Draft</span>
                    <Badge variant="outline">{stats.draft}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Generation Dialog */}
      <AIPersonaPromptDialog
        isOpen={showAIDialog}
        onOpenChange={setShowAIDialog}
        onGenerate={handleAIGeneration}
        isGenerating={isGenerating}
      />
    </div>
  );
}
