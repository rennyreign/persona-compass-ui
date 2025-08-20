import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from "@/integrations/supabase/client";

export default function CampaignPlan() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();
        
      if (error) {
        console.error('Error fetching campaign:', error);
      } else {
        setCampaign(data);
      }
      
      setLoading(false);
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);
  
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!campaign) {
    return <Navigate to="/404" replace />;
  }

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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-5xl mx-auto px-6 py-4">
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
                    <h1 className="text-2xl font-semibold text-foreground">Campaign Plan</h1>
                    <p className="text-sm text-muted-foreground">Detailed campaign strategy and execution plan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Info Banner */}
          <div className="bg-muted/30 border-b border-border">
            <div className="max-w-5xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">{campaign.title}</h2>
                  <div className="flex items-center space-x-3">
                    {(campaign.channels || []).slice(0, 2).map((channel: string, index: number) => (
                      <Badge key={index} variant="outline">{channel}</Badge>
                    ))}
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Started: {new Date(campaign.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    ${(campaign.budget || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-6 py-8">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Strategy & Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Campaign Plan Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Campaign plan details and strategy will be available here once configured.
                    </p>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Campaign Details</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Title:</strong> {campaign.title}</p>
                        <p><strong>Description:</strong> {campaign.description || 'No description available'}</p>
                        <p><strong>Type:</strong> {campaign.campaign_type || 'General'}</p>
                        <p><strong>Budget:</strong> ${(campaign.budget || 0).toLocaleString()}</p>
                        {campaign.objectives && campaign.objectives.length > 0 && (
                          <p><strong>Objectives:</strong> {campaign.objectives.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}