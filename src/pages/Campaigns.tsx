import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Edit, ExternalLink, Eye } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { EnhancedCreateCampaignDialog } from "@/components/campaign/EnhancedCreateCampaignDialog";
import { supabase } from "@/integrations/supabase/client";

export default function Campaigns() {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Fetch personas
      const { data: personasData, error: personasError } = await supabase
        .from('personas')
        .select('*')
        .eq('status', 'active')
        .order('name');
        
      if (campaignsError) {
        console.error('Error fetching campaigns:', campaignsError);
      } else {
        setCampaigns(campaignsData || []);
      }
      
      if (personasError) {
        console.error('Error fetching personas:', personasError);
      } else {
        setPersonas(personasData || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesPersona = selectedPersona === "all" || campaign.persona_id === selectedPersona;
    const matchesSearch = (campaign.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.channels || []).some((channel: string) => 
                           channel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPersona && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPersonaName = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    return persona?.name || 'Unknown Persona';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage and monitor all marketing campaigns across personas
                  </p>
                </div>
                <EnhancedCreateCampaignDialog 
                  onCampaignCreated={() => {
                    // Refresh campaigns list
                    const fetchCampaigns = async () => {
                      const { data, error } = await supabase
                        .from('campaigns')
                        .select('*')
                        .order('created_at', { ascending: false });
                      if (!error) setCampaigns(data || []);
                    };
                    fetchCampaigns();
                  }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-border text-foreground"
                />
              </div>
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white border-border text-foreground">
                  <SelectValue placeholder="Filter by persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Personas</SelectItem>
                  {personas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredCampaigns.length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredCampaigns.filter(c => c.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Draft Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {filteredCampaigns.filter(c => c.status === 'draft').length}
                    </div>
                  </CardContent>
                </Card>
            </div>

            {/* Campaigns Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns</CardTitle>
                <CardDescription>
                  Complete overview of campaign performance across all personas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Campaign</TableHead>
                      <TableHead className="w-[250px]">Persona</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Budget</TableHead>
                      <TableHead className="w-[140px]">Channels</TableHead>
                      <TableHead className="w-[100px]">Created</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="w-[200px]">
                          <div>
                            <div className="font-semibold text-foreground truncate">{campaign.name}</div>
                            {campaign.description && (
                              <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {campaign.description}
                              </div>
                            )}
                            {campaign.objective && (
                              <div className="text-xs text-blue-600 mt-1 font-medium truncate">
                                {campaign.objective}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-[250px]">
                          {campaign.persona_id && (
                            <Link 
                              to={`/persona/${campaign.persona_id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {personas.find(p => p.id === campaign.persona_id)?.name || 'Unknown'}
                            </Link>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              campaign.status === 'active' ? 'default' : 
                              campaign.status === 'draft' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.budget ? formatCurrency(campaign.budget) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {campaign.channels?.slice(0, 2).map((channel, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                            {campaign.channels && campaign.channels.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{campaign.channels.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/campaign/${campaign.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implement edit */}}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}