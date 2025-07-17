import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Archive, TrendingUp, Target, Brain, User, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonaPerformanceCharts } from "@/components/persona/PersonaPerformanceCharts";
import { PersonaCampaigns } from "@/components/persona/PersonaCampaigns";
import { PersonaInsights } from "@/components/persona/PersonaInsights";
import { PersonaVisualIdentity } from "@/components/persona/PersonaVisualIdentity";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { supabase } from "@/integrations/supabase/client";
import { Persona, Insight } from "@/types/persona";
import { toast } from "@/hooks/use-toast";


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
                  <Button variant="outline" size="sm" onClick={() => navigate(`/persona/${persona.id}/edit`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchivePersona}>
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
                    <Badge className={`px-3 py-1 ${
                      persona.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-gray-100 text-gray-800 border-gray-200'
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="details" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center space-x-2">
              <Images className="w-4 h-4" />
              <span>Visual Identity</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Demographics</span>
                  </CardTitle>
                  <CardDescription>
                    Statistical data about the persona's background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-sm text-foreground mt-1">{persona.location || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Income Range</label>
                      <p className="text-sm text-foreground mt-1">{persona.income_range || "Not specified"}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                      <p className="text-sm text-foreground mt-1">{persona.education_level || "Not specified"}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Industry</label>
                      <p className="text-sm text-foreground mt-1">{persona.industry || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Psychographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Psychographics</span>
                  </CardTitle>
                  <CardDescription>
                    Psychological attributes and behavioral patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Core Values</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {persona.values && persona.values.length > 0 ? (
                        persona.values.map((value, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No values specified</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Personality Traits</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {persona.personality_traits && persona.personality_traits.length > 0 ? (
                        persona.personality_traits.map((trait, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No personality traits specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals and Pain Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {persona.goals && persona.goals.length > 0 ? (
                      persona.goals.map((goal, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{goal}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">No goals specified</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Pain Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {persona.pain_points && persona.pain_points.length > 0 ? (
                      persona.pain_points.map((painPoint, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{painPoint}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">No pain points specified</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Preferred Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Channels</CardTitle>
                <CardDescription>
                  Communication channels where this persona is most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {persona.preferred_channels && persona.preferred_channels.length > 0 ? (
                    persona.preferred_channels.map((channel, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {channel}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferred channels specified</p>
                  )}
                </div>
              </CardContent>
            </Card>
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