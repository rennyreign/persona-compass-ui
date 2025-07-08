import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { mockCampaigns } from "@/data/mockData";
import { CreateCampaignDialog } from "@/components/campaign/CreateCampaignDialog";

interface PersonaCampaignsProps {
  personaId: string;
}

export function PersonaCampaigns({ personaId }: PersonaCampaignsProps) {
  const campaigns = mockCampaigns.filter(campaign => campaign.personaId === personaId);

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

  return (
    <div className="space-y-6">
      {/* Campaign Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {campaigns.reduce((sum, c) => sum + c.leads, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Detailed performance metrics for all campaigns targeting this persona
              </CardDescription>
            </div>
            <CreateCampaignDialog />
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found for this persona.</p>
              <div className="mt-4">
                <CreateCampaignDialog trigger={<Button>Create First Campaign</Button>} />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
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
                {campaigns.map((campaign) => (
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

      {/* Campaign Notes */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.channel} Campaign</CardDescription>
                  </div>
                  <Link to={`/campaign/${campaign.id}`}>
                    <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600">
                      <FileText className="w-4 h-4 mr-2" />
                      View Plan
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{campaign.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}