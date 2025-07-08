import { useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mockCampaigns, mockCampaignPlans } from "@/data/mockData";

export default function CampaignPlan() {
  const { campaignId } = useParams();
  
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  const campaignPlan = mockCampaignPlans.find(p => p.campaignId === campaignId);
  
  if (!campaign || !campaignPlan) {
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
                  <h2 className="text-xl font-semibold text-foreground">{campaign.name}</h2>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{campaign.channel}</Badge>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Started: {new Date(campaign.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    ${campaign.spend.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spend</div>
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
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold text-foreground mb-2 mt-5">{children}</h3>,
                      p: ({children}) => <p className="text-muted-foreground mb-3 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc pl-6 mb-4 text-muted-foreground">{children}</ul>,
                      li: ({children}) => <li className="mb-1">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                      hr: () => <Separator className="my-6" />,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">{children}</blockquote>,
                    }}
                  >
                    {campaignPlan.markdownContent}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}