import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { mockCampaigns, mockPersonas } from "@/data/mockData";

export default function Campaigns() {
  const [selectedPersona, setSelectedPersona] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesPersona = selectedPersona === "all" || campaign.personaId === selectedPersona;
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.channel.toLowerCase().includes(searchQuery.toLowerCase());
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
    const persona = mockPersonas.find(p => p.id === personaId);
    return persona?.name || 'Unknown Persona';
  };

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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
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
                  className="pl-10"
                />
              </div>
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Personas</SelectItem>
                  {mockPersonas.map((persona) => (
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(filteredCampaigns.reduce((sum, c) => sum + c.spend, 0))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {filteredCampaigns.reduce((sum, c) => sum + c.leads, 0)}
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
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Persona</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Spend</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>CPL</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <Link 
                                to={`/campaign/${campaign.id}`}
                                className="font-medium text-foreground hover:text-green-600 hover:underline transition-colors"
                              >
                                {campaign.name}
                              </Link>
                              <div className="text-sm text-muted-foreground">{campaign.cta}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link 
                              to={`/persona/${campaign.personaId}`}
                              className="text-sm text-muted-foreground hover:text-green-600 hover:underline transition-colors"
                            >
                              {getPersonaName(campaign.personaId)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{campaign.channel}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(campaign.spend)}
                          </TableCell>
                          <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                          <TableCell>{campaign.leads}</TableCell>
                          <TableCell>
                            {formatCurrency(campaign.spend / campaign.leads)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(campaign.startDate)}
                          </TableCell>
                          <TableCell>
                            <Link to={`/campaign/${campaign.id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hover:bg-green-50 hover:text-green-600"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}