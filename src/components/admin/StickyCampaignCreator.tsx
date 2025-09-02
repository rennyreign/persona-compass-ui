import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Target, Users, Sparkles, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { Persona } from '@/types/persona';
import { useToast } from '@/hooks/use-toast';

interface StickyCampaignCreatorProps {
  selectedPersonas: Persona[];
  onClearSelection: () => void;
}

export function StickyCampaignCreator({ selectedPersonas, onClearSelection }: StickyCampaignCreatorProps) {
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    campaignType: '',
    channels: [] as string[],
  });
  const { toast } = useToast();

  if (selectedPersonas.length === 0) {
    return null;
  }

  const handleCreateCampaign = () => {
    setIsCreatingCampaign(true);
  };

  const handleSubmitCampaign = async () => {
    try {
      // Here you would normally create the campaign
      toast({
        title: "Campaign Created",
        description: `Successfully created campaign with ${selectedPersonas.length} personas.`,
      });
      setIsCreatingCampaign(false);
      onClearSelection();
      setCampaignData({
        title: '',
        description: '',
        budget: '',
        startDate: '',
        endDate: '',
        campaignType: '',
        channels: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUniquePrograms = () => {
    const programs = new Set(selectedPersonas.map(p => p.program_category).filter(Boolean));
    return Array.from(programs);
  };

  const getPersonaBreakdown = () => {
    const breakdown: Record<string, number> = {};
    selectedPersonas.forEach(persona => {
      const program = persona.program_category || 'Unknown';
      breakdown[program] = (breakdown[program] || 0) + 1;
    });
    return breakdown;
  };

  return (
    <>
      {/* Sticky Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">
                    {selectedPersonas.length} Persona{selectedPersonas.length !== 1 ? 's' : ''} Selected
                  </div>
                  <div className="text-sm text-muted-foreground">
                    From {getUniquePrograms().length} program{getUniquePrograms().length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {getUniquePrograms().slice(0, 3).map(program => (
                  <Badge key={program} variant="secondary" className="text-xs">
                    {program}
                  </Badge>
                ))}
                {getUniquePrograms().length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{getUniquePrograms().length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Selection
              </Button>
              <Button
                onClick={handleCreateCampaign}
                className="flex items-center gap-2 px-6"
              >
                <Target className="h-4 w-4" />
                Create Campaign ({selectedPersonas.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Creation Sheet */}
      <Sheet open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
        <SheetContent side="right" className="w-[700px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Create New Campaign
            </SheetTitle>
            <SheetDescription>
              Configure your campaign using {selectedPersonas.length} selected personas
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full mt-6 pr-4">
            <div className="space-y-6">
              {/* Selected Personas Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Selected Personas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getPersonaBreakdown()).map(([program, count]) => (
                      <div key={program} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{program}</span>
                        <Badge variant="secondary">{count} persona{count !== 1 ? 's' : ''}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Reach:</span>
                        <div className="text-muted-foreground">~{selectedPersonas.length * 15000} potential leads</div>
                      </div>
                      <div>
                        <span className="font-medium">Estimated CPL:</span>
                        <div className="text-muted-foreground">$45 - $85</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Campaign Title</label>
                    <Input
                      placeholder="Enter campaign title..."
                      value={campaignData.title}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe your campaign objectives..."
                      value={campaignData.description}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={campaignData.startDate}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={campaignData.endDate}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Campaign Type</label>
                    <Select value={campaignData.campaignType} onValueChange={(value) => setCampaignData(prev => ({ ...prev, campaignType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-generation">Lead Generation</SelectItem>
                        <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                        <SelectItem value="enrollment">Enrollment Drive</SelectItem>
                        <SelectItem value="webinar">Webinar Promotion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="10000"
                        value={campaignData.budget}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Projections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Projected Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Expected Leads</div>
                      <div className="text-2xl font-bold text-primary">245-380</div>
                      <div className="text-muted-foreground">Based on persona selection</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="font-semibold">Est. Conversion Rate</div>
                      <div className="text-2xl font-bold text-green-600">12-18%</div>
                      <div className="text-muted-foreground">Higher ed benchmark</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingCampaign(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitCampaign}
                  className="flex-1"
                  disabled={!campaignData.title || !campaignData.campaignType}
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}