import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Archive, TrendingUp, Target, Brain, User, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { mockPersonas, mockInsights, Persona } from "@/data/mockData";
import { PersonaPerformanceCharts } from "@/components/persona/PersonaPerformanceCharts";
import { PersonaCampaigns } from "@/components/persona/PersonaCampaigns";
import { PersonaInsights } from "@/components/persona/PersonaInsights";
import { PersonaVisualIdentity } from "@/components/persona/PersonaVisualIdentity";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { cn } from "@/lib/utils";

export default function PersonaProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  const persona = mockPersonas.find(p => p.id === id);
  
  if (!persona) {
    return <Navigate to="/404" replace />;
  }

  const personaInsights = mockInsights.filter(insight => insight.personaId === persona.id);

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
                    onClick={() => window.history.back()}
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
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
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
                  {persona.avatar ? (
                    <AvatarImage 
                      src={persona.avatar} 
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
                    <p className="text-lg text-muted-foreground italic">{persona.motivationalTagline}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      {persona.program}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {persona.ageRange} years
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      {persona.careerStage}
                    </Badge>
                    {persona.isActive && (
                      <Badge className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="hidden lg:flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">${persona.performance.cpl.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">CPL</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{persona.performance.ctr}%</div>
                    <div className="text-sm text-muted-foreground">CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{persona.performance.totalLeads}</div>
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
                      <p className="text-sm text-foreground mt-1">{persona.demographics.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Income Range</label>
                      <p className="text-sm text-foreground mt-1">{persona.demographics.income}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                      <p className="text-sm text-foreground mt-1">{persona.demographics.education}</p>
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
                      {persona.psychographics.values.map((value, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {persona.psychographics.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Lifestyle</label>
                    <p className="text-sm text-foreground mt-1">{persona.psychographics.lifestyle}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals, Fears, Motivations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {persona.goals.map((goal, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Fears</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {persona.fears.map((fear, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{fear}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Motivations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {persona.motivations.map((motivation, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start space-x-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{motivation}</span>
                      </li>
                    ))}
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
                  {persona.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Program Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Program Requirements</CardTitle>
                <CardDescription>
                  What this persona needs from an educational program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {persona.programNeeds.map((need, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-sm text-foreground">{need}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <PersonaVisualIdentity 
              images={persona.moodBoardImages} 
              personaName={persona.name}
            />
          </TabsContent>

          <TabsContent value="performance">
            <PersonaPerformanceCharts persona={persona} />
          </TabsContent>

          <TabsContent value="campaigns">
            <PersonaCampaigns personaId={persona.id} />
          </TabsContent>

          <TabsContent value="insights">
            <PersonaInsights personaId={persona.id} insights={personaInsights} />
          </TabsContent>
        </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}