import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Share2 } from "lucide-react";
import { CreateCampaignDialog } from "@/components/campaign/CreateCampaignDialog";
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
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
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
                  <CreateCampaignDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    }
                    editMode={true}
                    existingCampaign={campaign}
                    onCampaignCreated={() => {
                      // Refresh campaign data after edit
                      window.location.reload();
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      // Could add a toast notification here
                    }}
                  >
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
                <div className="space-y-8">
                  {/* Campaign Overview Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Campaign Overview</h3>
                    
                    {/* Strategic Context */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-lg border-l-4 border-emerald-500">
                      <h4 className="font-semibold text-emerald-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Market Context & Strategic Opportunity
                      </h4>
                      <div className="space-y-3">
                        <p className="text-emerald-800 font-medium leading-relaxed">
                          Current market conditions show 73% of working professionals seeking leadership advancement within 18 months, while only 23% feel adequately prepared for senior management roles. This campaign directly addresses the leadership skills gap in mid-level management.
                        </p>
                        <div className="bg-emerald-100 p-3 rounded text-sm">
                          <strong>Industry Context:</strong> Supply chain disruptions and digital transformation have accelerated demand for strategic leadership skills, with 89% of organizations prioritizing management development over the next 24 months.
                        </div>
                      </div>
                    </div>

                    {/* Target Audience Deep Dive */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Primary Target Personas & Strategic Rationale
                      </h4>
                      
                      <div className="grid gap-4 mb-4">
                        {/* Team Leader Persona */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-blue-900">Amanda Thompson Profile: Team Leaders</h5>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Primary 65%</span>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-700">
                              <strong>Demographics:</strong> Ages 30-40, $60-90k income, 7-12 years experience, team supervision roles in healthcare/financial services/technology
                            </p>
                            <p className="text-gray-700">
                              <strong>Pain Points:</strong> Managing difficult team members without formal leadership training, limited advancement opportunities, work-life balance challenges
                            </p>
                            <p className="text-gray-700">
                              <strong>Conversion Triggers:</strong> Promotion opportunities requiring leadership credentials, team performance challenges, employer tuition reimbursement availability
                            </p>
                            <div className="bg-blue-50 p-2 rounded mt-2">
                              <strong className="text-blue-800">Campaign Angle:</strong> "Transform from Team Leader to Strategic Manager - advance your career while maintaining work-life balance"
                            </div>
                          </div>
                        </div>

                        {/* Operations Manager Persona */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-purple-900">Sarah Chen Profile: Operations Managers</h5>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Secondary 35%</span>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-700">
                              <strong>Demographics:</strong> Ages 32-42, $65-95k income, 8-15 years experience, operations roles in manufacturing/automotive
                            </p>
                            <p className="text-gray-700">
                              <strong>Pain Points:</strong> Supply chain disruptions, lack of strategic training, need for advanced analytics skills
                            </p>
                            <p className="text-gray-700">
                              <strong>Conversion Triggers:</strong> Director-level promotion opportunities, supply chain crisis experiences, industry networking events
                            </p>
                            <div className="bg-purple-50 p-2 rounded mt-2">
                              <strong className="text-purple-800">Campaign Angle:</strong> "Master Strategic Operations Leadership - from managing disruptions to driving competitive advantage"
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-100 p-3 rounded text-sm">
                        <strong>Strategic Rationale:</strong> These personas represent 78% of MSU's highest-converting audience segments with average 120-day decision timelines and strong employer tuition support. Both groups show immediate application potential with current roles.
                      </div>
                    </div>

                    {/* Core Message & Value Proposition */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-l-4 border-amber-500">
                      <h4 className="font-semibold text-amber-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        Core Value Proposition & Messaging Strategy
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded border-l-4 border-amber-300">
                          <h5 className="font-semibold text-amber-900 mb-2">Primary Message: "Future-Focused Leadership Excellence"</h5>
                          <p className="text-amber-800 font-medium leading-relaxed">
                            "Accelerate your leadership career with AACSB-accredited strategic management skills that drive immediate impact while maintaining work-life balance"
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded text-sm">
                            <strong className="text-amber-900">Awareness Stage:</strong>
                            <p className="text-gray-700">"Make tomorrow's business happen today - Strategic leadership for the modern professional"</p>
                          </div>
                          <div className="bg-white p-3 rounded text-sm">
                            <strong className="text-amber-900">Consideration Stage:</strong>
                            <p className="text-gray-700">"AACSB-accredited leadership education from Top 25 ranked online business programs"</p>
                          </div>
                          <div className="bg-white p-3 rounded text-sm">
                            <strong className="text-amber-900">Conversion Stage:</strong>
                            <p className="text-gray-700">"Begin your leadership transformation in 20 months - Apply today and advance your career"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Objectives & Success Metrics */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Strategic Objectives & Success Metrics</h3>
                    
                    {/* Primary Objectives */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Campaign Objectives & Strategic Rationale
                      </h4>
                      
                      <div className="grid gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-3 border-green-400">
                          <h5 className="font-semibold text-green-900 mb-2">1. Generate 120 Qualified MSL Program Enrollments</h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Strategic Rationale:</strong> MSU's MSL program has a target enrollment of 100 students. This campaign aims for 120% of capacity to account for program growth and competitive positioning.
                          </p>
                          <div className="bg-green-50 p-2 rounded text-xs">
                            <strong>Success Criteria:</strong> 15-25% lead-to-enrollment conversion rate based on historical MSU performance data
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-3 border-green-400">
                          <h5 className="font-semibold text-green-900 mb-2">2. Establish MSU as #1 Choice for Leadership Development</h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Strategic Rationale:</strong> Leverage MSU's existing #1 General Management and #2 Leadership specialty rankings to capture larger market share in the $2.3B leadership education market.
                          </p>
                          <div className="bg-green-50 p-2 rounded text-xs">
                            <strong>Success Criteria:</strong> 40% brand consideration increase among target personas within 6 months
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-3 border-green-400">
                          <h5 className="font-semibold text-green-900 mb-2">3. Build High-Value Audience Pipeline</h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Strategic Rationale:</strong> Focus on high-intent prospects with employer tuition support ($33,900 program cost) and immediate career advancement opportunities.
                          </p>
                          <div className="bg-green-50 p-2 rounded text-xs">
                            <strong>Success Criteria:</strong> 65% of leads must meet "Team Leader" or "Operations Manager" persona criteria
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics Framework */}
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border-l-4 border-purple-500">
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Performance Measurement Framework
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Leading Indicators */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-purple-900">Leading Indicators (Campaign Health)</h5>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Click-Through Rate</span>
                                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">Target: 4.2%</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Industry benchmark: 2.8%, MSU historical: 3.9%</div>
                            </div>
                            
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Cost Per Lead</span>
                                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">Target: $45</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Based on Team Leader persona conversion data</div>
                            </div>
                            
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Lead Quality Score</span>
                                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">Target: 7.5/10</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Persona fit + intent + engagement composite</div>
                            </div>
                          </div>
                        </div>

                        {/* Lagging Indicators */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-purple-900">Lagging Indicators (Business Impact)</h5>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Application Conversion</span>
                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Target: 22%</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Lead to completed application within 120 days</div>
                            </div>
                            
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Enrollment Rate</span>
                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Target: 18%</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Application to enrollment (accounting for admissions)</div>
                            </div>
                            
                            <div className="bg-white p-3 rounded shadow-sm">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Return on Ad Spend</span>
                                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Target: 8.2x</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">Program revenue vs. campaign investment</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Success Timeline */}
                      <div className="mt-4 bg-white p-4 rounded border-l-4 border-purple-300">
                        <h5 className="font-semibold text-purple-900 mb-2">Expected Success Timeline</h5>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-purple-800">Month 1-2</div>
                            <div className="text-gray-600">Brand awareness + lead generation ramp</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-800">Month 3-4</div>
                            <div className="text-gray-600">Application conversion optimization</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-800">Month 5-6</div>
                            <div className="text-gray-600">Enrollment momentum + retention focus</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-800">Ongoing</div>
                            <div className="text-gray-600">Alumni advocacy + word-of-mouth</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Channel Strategy & Content Framework */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Channel Strategy & Content Framework</h3>
                    
                    {/* Strategic Channel Selection */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        Strategic Channel Allocation & Budget Distribution
                      </h4>

                      <div className="grid gap-4">
                        {/* LinkedIn - Primary Channel */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-blue-900">LinkedIn (Primary Channel)</h5>
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">60% Budget</span>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-700">
                              <strong>Strategic Rationale:</strong> Both target personas (Amanda Thompson - Team Leader, Sarah Chen - Operations Manager) are highly active on LinkedIn for professional development content consumption.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <div className="bg-blue-50 p-2 rounded">
                                <strong className="text-blue-800">Sponsored Content:</strong> Leadership development articles, career advancement case studies
                              </div>
                              <div className="bg-blue-50 p-2 rounded">
                                <strong className="text-blue-800">InMail Campaigns:</strong> Personalized outreach to qualified prospects with leadership challenges
                              </div>
                            </div>
                            <div className="bg-blue-100 p-2 rounded text-xs">
                              <strong>Expected Performance:</strong> CTR 4.5%, CPL $42, Lead Quality Score 8.1/10
                            </div>
                          </div>
                        </div>

                        {/* Google Search - Secondary Channel */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-green-900">Google Search (High-Intent)</h5>
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">25% Budget</span>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-700">
                              <strong>Strategic Rationale:</strong> Capture demand from professionals actively researching "leadership development programs," "online management degrees," and "career advancement education."
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <div className="bg-green-50 p-2 rounded">
                                <strong className="text-green-800">High-Intent Keywords:</strong> "online leadership degree," "management strategy program"
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <strong className="text-green-800">Competitor Keywords:</strong> Alternative program comparisons, "vs [competitor]"
                              </div>
                            </div>
                            <div className="bg-green-100 p-2 rounded text-xs">
                              <strong>Expected Performance:</strong> CTR 3.8%, CPL $52, Conversion Rate 24%
                            </div>
                          </div>
                        </div>

                        {/* Professional Networks - Supporting Channel */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-purple-900">Professional Networks & Associations</h5>
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">15% Budget</span>
                          </div>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-700">
                              <strong>Strategic Rationale:</strong> Leverage Sarah Chen's engagement with industry publications and Amanda Thompson's interest in management blogs for authentic touchpoints.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                              <div className="bg-purple-50 p-2 rounded">
                                <strong className="text-purple-800">Industry Publications:</strong> Harvard Business Review, McKinsey Insights
                              </div>
                              <div className="bg-purple-50 p-2 rounded">
                                <strong className="text-purple-800">Associations:</strong> APICS, Project Management Institute
                              </div>
                            </div>
                            <div className="bg-purple-100 p-2 rounded text-xs">
                              <strong>Expected Performance:</strong> Brand Lift +45%, Consideration +38%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Strategy Framework */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border-l-4 border-rose-500">
                      <h4 className="font-semibold text-rose-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                        Content Strategy & Creative Assets Framework
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Awareness Stage Content */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-rose-900">Awareness Stage</h5>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">📊 Leadership Skills Gap Report</h6>
                              <p className="text-xs text-gray-600">Industry data on management skills shortage + MSU solution positioning</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">🎯 "Future-Focused Leader" Video Series</h6>
                              <p className="text-xs text-gray-600">Thought leadership content featuring MSU faculty on emerging leadership trends</p>
                            </div>
                          </div>
                        </div>

                        {/* Consideration Stage Content */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-rose-900">Consideration Stage</h5>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">📋 Interactive Leadership Assessment</h6>
                              <p className="text-xs text-gray-600">Self-diagnostic tool mapping current skills to MSL curriculum areas</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">📈 ROI Calculator & Career Path Guide</h6>
                              <p className="text-xs text-gray-600">Personalized career advancement timeline and salary impact projections</p>
                            </div>
                          </div>
                        </div>

                        {/* Conversion Stage Content */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-rose-900">Conversion Stage</h5>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">🎓 Virtual Program Experience</h6>
                              <p className="text-xs text-gray-600">Sample MSL course content + faculty interaction + student testimonials</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <h6 className="font-medium text-sm text-gray-800 mb-1">💼 Success Stories & Alumni Impact</h6>
                              <p className="text-xs text-gray-600">Case studies of Team Leaders & Operations Managers post-graduation</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Messaging Testing Framework */}
                      <div className="bg-white p-4 rounded-lg border-l-4 border-rose-300">
                        <h5 className="font-semibold text-rose-900 mb-3">A/B Testing Framework</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <strong className="text-rose-800">Message Angle Test:</strong>
                            <div className="text-gray-600 mt-1">
                              • "ROI & promotion focus" vs.<br/>
                              • "Lead teams confidently" vs.<br/>
                              • "Strategic leadership edge"
                            </div>
                          </div>
                          <div>
                            <strong className="text-rose-800">Creative Format Test:</strong>
                            <div className="text-gray-600 mt-1">
                              • Video testimonials vs.<br/>
                              • Static infographics vs.<br/>
                              • Interactive assessments
                            </div>
                          </div>
                          <div>
                            <strong className="text-rose-800">CTA Optimization:</strong>
                            <div className="text-gray-600 mt-1">
                              • "Start Your Leadership Journey" vs.<br/>
                              • "Get Your Free Assessment" vs.<br/>
                              • "Download Career Guide"
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Impact & ROI Projections */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Business Impact & ROI Projections</h3>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-6 rounded-lg border-l-4 border-slate-500">
                      <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-slate-500 rounded-full mr-2"></span>
                        Expected Campaign Performance & Business Impact
                      </h4>
                      
                      {/* Key Performance Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                          <div className="text-2xl font-bold text-green-600">120</div>
                          <div className="text-sm text-gray-600 mb-1">Target Enrollments</div>
                          <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">$4.07M Revenue</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                          <div className="text-2xl font-bold text-blue-600">667</div>
                          <div className="text-sm text-gray-600 mb-1">Qualified Leads Needed</div>
                          <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">18% Conv. Rate</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                          <div className="text-2xl font-bold text-purple-600">8.2x</div>
                          <div className="text-sm text-gray-600 mb-1">Expected ROAS</div>
                          <div className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">$495k Investment</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-500">
                          <div className="text-2xl font-bold text-orange-600">6</div>
                          <div className="text-sm text-gray-600 mb-1">Month Payback</div>
                          <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">Break-even Point</div>
                        </div>
                      </div>

                      {/* Strategic Value Beyond Direct ROI */}
                      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-400">
                        <h5 className="font-semibold text-indigo-900 mb-3">Strategic Value Beyond Direct ROI</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h6 className="font-medium text-gray-800">Brand & Market Position</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Reinforce MSU's #1 General Management ranking</li>
                              <li>• Capture 18% market share in leadership education</li>
                              <li>• Build alumni network of 120 senior leaders</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h6 className="font-medium text-gray-800">Long-term Pipeline Value</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Alumni referral network generating 25% of future leads</li>
                              <li>• Corporate partnership opportunities from enrolled companies</li>
                              <li>• Enhanced employer tuition reimbursement relationships</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Success Milestones & Optimization Triggers */}
                      <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-400">
                        <h5 className="font-semibold text-emerald-900 mb-3">Success Milestones & Optimization Triggers</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong className="text-emerald-800">Month 1-2 Success Criteria:</strong>
                            <div className="text-gray-600 mt-1">
                              • CTR above 4.0% on LinkedIn<br/>
                              • Cost per lead under $50<br/>
                              • 150+ qualified leads generated
                            </div>
                          </div>
                          <div>
                            <strong className="text-emerald-800">Month 3-4 Optimization Points:</strong>
                            <div className="text-gray-600 mt-1">
                              • Application rate above 20%<br/>
                              • Lead quality score 7.5+<br/>
                              • Channel attribution analysis
                            </div>
                          </div>
                          <div>
                            <strong className="text-emerald-800">Month 5-6 Scale Indicators:</strong>
                            <div className="text-gray-600 mt-1">
                              • 80+ applications submitted<br/>
                              • ROAS trending above 6x<br/>
                              • Alumni advocacy program launch
                            </div>
                          </div>
                        </div>
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