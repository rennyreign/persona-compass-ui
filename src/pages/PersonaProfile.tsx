import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Archive, TrendingUp, Target, Brain, User, Images, MapPin, DollarSign, GraduationCap, Building, Users, Heart, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonaPerformanceCharts } from "@/components/persona/PersonaPerformanceCharts";
import { PersonaCampaigns } from "@/components/persona/PersonaCampaigns";
import { PersonaInsights } from "@/components/persona/PersonaInsights";
import { PersonaVisualIdentity } from "@/components/persona/PersonaVisualIdentity";
import { PersonaValidation } from "@/components/persona/PersonaValidation";
import { PersonaAttributesList } from "@/components/persona/PersonaAttributesList";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { Persona, Insight } from "@/types/persona";
import { toast } from "@/hooks/use-toast";
import { formatPersonaAttribute } from '@/utils/formatPersonaAttributes';


export default function PersonaProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // Fetch persona data
      const { data: personaData, error: personaError } = await supabase
        .from('personas')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (personaError) {
        console.error('Error fetching persona:', personaError);
        setPersona(null);
        setLoading(false);
        return;
      }
      
      setPersona(personaData);
      
      // Fetch insights for this persona
      const { data: insightsData, error: insightsError } = await supabase
        .from('insights')
        .select('*')
        .eq('persona_id', id)
        .order('generated_at', { ascending: false });
        
      if (insightsError) {
        console.error('Error fetching insights:', insightsError);
      } else {
        setInsights((insightsData || []) as Insight[]);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [id]);

  const handleArchivePersona = async () => {
    if (!persona) return;
    
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', persona.id);
      
    if (error) {
      console.error('Error deleting persona:', error);
      toast({
        title: "Error",
        description: "Failed to delete persona",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Persona deleted successfully",
      });
      navigate("/");
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg text-muted-foreground">Loading persona...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!persona) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/")}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">Persona Profile</h1>
                    <p className="text-sm text-muted-foreground">Detailed persona analytics and insights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/persona/${persona.id}/edit`)} 
                    className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchivePersona}
                    className="border-muted-foreground/30 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground transition-all duration-200">
                    <Archive className="w-4 h-4 mr-2" />
                    {persona.status === 'active' ? 'Archive' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  {persona.avatar_url ? (
                    <AvatarImage 
                      src={persona.avatar_url} 
                      alt={persona.name} 
                      className="object-cover object-center"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                      {persona.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{persona.name}</h1>
                    <p className="text-lg text-muted-foreground italic">{persona.description || "No description available"}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {persona.program_category && (
                      <Badge variant="secondary" className="px-3 py-1">
                        {persona.program_category}
                      </Badge>
                    )}
                    {persona.age_range && (
                      <Badge variant="outline" className="px-3 py-1">
                        {persona.age_range} years
                      </Badge>
                    )}
                    {persona.occupation && (
                      <Badge variant="outline" className="px-3 py-1">
                        {persona.occupation}
                      </Badge>
                    )}
                    <Badge className={`px-3 py-1 transition-colors duration-200 ${
                      persona.status === 'active' 
                        ? 'bg-success/20 text-success border-success/30 hover:bg-success/30' 
                        : 'bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80'
                    }`}>
                      {persona.status === 'active' ? 'Active' : 'Archived'}
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats - Placeholder for now */}
                <div className="hidden lg:flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">$45</div>
                    <div className="text-sm text-muted-foreground">CPL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">3.2%</div>
                    <div className="text-sm text-muted-foreground">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Total Leads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 bg-muted/30 border border-border/50">
            <TabsTrigger value="details" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <User className="w-4 h-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Target className="w-4 h-4" />
              <span>Validation</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Images className="w-4 h-4" />
              <span>Visual Identity</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <TrendingUp className="w-4 h-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Target className="w-4 h-4" />
              <span>Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Brain className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                    <CardDescription>
                      Statistical data about the persona's background
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-sm text-foreground mt-1">{persona.location || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Income Range</label>
                        <p className="text-sm text-foreground mt-1">{persona.income_range || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                        <p className="text-sm text-foreground mt-1">{persona.education_level || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Industry</label>
                        <p className="text-sm text-foreground mt-1">{persona.industry || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Goals & Aspirations</CardTitle>
                    <CardDescription>
                      What this persona wants to achieve
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PersonaAttributesList 
                      attributes={persona.goals} 
                      title="Goals" 
                      emptyMessage="No goals specified"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Psychographics</CardTitle>
                    <CardDescription>
                      Psychological attributes and behavioral patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PersonaAttributesList 
                      attributes={persona.values} 
                      title="Core Values" 
                      emptyMessage="No values specified"
                    />
                    <PersonaAttributesList 
                      attributes={persona.personality_traits} 
                      title="Personality Traits" 
                      emptyMessage="No personality traits specified"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pain Points & Challenges</CardTitle>
                    <CardDescription>
                      What frustrates or blocks this persona
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PersonaAttributesList 
                      attributes={persona.pain_points} 
                      title="Pain Points" 
                      emptyMessage="No pain points specified"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cost Per Lead</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$45.20</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Click-Through Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3.2%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">156</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="validation">
            <PersonaValidation persona={persona} />
          </TabsContent>

          <TabsContent value="visual">
            <PersonaVisualIdentity 
              images={persona.visual_identity_images || []} 
              personaName={persona.name}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PersonaPerformanceCharts personaId={persona.id} />
          </TabsContent>

          <TabsContent value="campaigns">
            <PersonaCampaigns personaId={persona.id} />
          </TabsContent>

          <TabsContent value="insights">
            <PersonaInsights personaId={persona.id} insights={insights} />
          </TabsContent>
        </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}