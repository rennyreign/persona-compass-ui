import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPersonas } from "@/data/mockData";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { toast } from "@/hooks/use-toast";

const programOptions = [
  "Supply Chain",
  "Healthcare", 
  "Management Strategy & Leadership"
];

const ageRangeOptions = [
  "18-22", "23-27", "28-35", "36-45", "46-55", "56-65", "65+"
];

const careerStageOptions = [
  "Undergraduate", "Graduate", "Early Career", "Mid Career", 
  "Senior Professional", "Executive", "Career Transition"
];

export default function EditPersona() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  
  const persona = mockPersonas.find(p => p.id === id);
  
  const [formData, setFormData] = useState({
    name: persona?.name || "",
    program: persona?.program || "",
    ageRange: persona?.ageRange || "",
    careerStage: persona?.careerStage || "",
    avatar: persona?.avatar || "",
    motivationalTagline: persona?.motivationalTagline || "",
    isActive: persona?.isActive || true,
    location: persona?.demographics.location || "",
    income: persona?.demographics.income || "",
    education: persona?.demographics.education || "",
    lifestyle: persona?.psychographics.lifestyle || "",
    cpl: persona?.performance.cpl || 0,
    ctr: persona?.performance.ctr || 0,
    conversionRate: persona?.performance.conversionRate || 0,
    totalSpend: persona?.performance.totalSpend || 0,
    totalLeads: persona?.performance.totalLeads || 0,
  });

  const [visualIdentityImages, setVisualIdentityImages] = useState<string[]>(
    persona?.moodBoardImages || []
  );

  if (!persona) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground mb-2">Persona Not Found</h1>
              <p className="text-muted-foreground mb-4">The persona you're trying to edit doesn't exist.</p>
              <Button onClick={() => navigate("/")}>Go Back to Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    toast({
      title: "Success",
      description: "Persona updated successfully!",
    });
    navigate(`/persona/${id}`);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          newImages.push(imageUrl);
        }
      });
      setVisualIdentityImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setVisualIdentityImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

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
                    onClick={() => navigate(`/persona/${id}`)}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">Edit Persona</h1>
                    <p className="text-sm text-muted-foreground">Modify persona details and preferences</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => navigate(`/persona/${id}`)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="visual">Visual Identity</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  <TabsTrigger value="psychographics">Psychology</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Core persona details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter persona name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="program">Program</Label>
                          <Select
                            value={formData.program}
                            onValueChange={(value) => handleInputChange("program", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent>
                              {programOptions.map((program) => (
                                <SelectItem key={program} value={program}>
                                  {program}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="ageRange">Age Range</Label>
                          <Select
                            value={formData.ageRange}
                            onValueChange={(value) => handleInputChange("ageRange", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select age range" />
                            </SelectTrigger>
                            <SelectContent>
                              {ageRangeOptions.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="careerStage">Career Stage</Label>
                          <Select
                            value={formData.careerStage}
                            onValueChange={(value) => handleInputChange("careerStage", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select career stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {careerStageOptions.map((stage) => (
                                <SelectItem key={stage} value={stage}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="motivationalTagline">Motivational Tagline</Label>
                          <Textarea
                            id="motivationalTagline"
                            value={formData.motivationalTagline}
                            onChange={(e) => handleInputChange("motivationalTagline", e.target.value)}
                            placeholder="Enter a motivational tagline"
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="isActive">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                              Whether this persona is currently active
                            </p>
                          </div>
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Avatar & Images</CardTitle>
                        <CardDescription>Visual identity settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={formData.avatar}
                            onChange={(e) => handleInputChange("avatar", e.target.value)}
                            placeholder="Enter avatar image URL"
                          />
                        </div>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload new avatar image
                          </p>
                          <Button type="button" variant="outline" size="sm" className="mt-2">
                            Choose File
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="visual" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Images className="w-5 h-5 text-primary" />
                        <span>Visual Identity Images</span>
                      </CardTitle>
                      <CardDescription>Upload and manage mood board images for this persona</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload images to create a visual mood board
                        </p>
                        <input
                          type="file"
                          id="visual-identity-upload"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.getElementById('visual-identity-upload')?.click()}
                        >
                          Choose Images
                        </Button>
                      </div>

                      {/* Image Grid */}
                      {visualIdentityImages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Current Images ({visualIdentityImages.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {visualIdentityImages.map((imageUrl, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square overflow-hidden rounded-lg bg-muted border border-border"
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Visual identity ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {visualIdentityImages.length === 0 && (
                        <div className="text-center py-8">
                          <Images className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No images uploaded yet. Add some images to create a visual mood board.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="demographics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Demographic Information</CardTitle>
                      <CardDescription>Statistical background data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="Enter location"
                          />
                        </div>

                        <div>
                          <Label htmlFor="income">Income Range</Label>
                          <Input
                            id="income"
                            value={formData.income}
                            onChange={(e) => handleInputChange("income", e.target.value)}
                            placeholder="Enter income range"
                          />
                        </div>

                        <div>
                          <Label htmlFor="education">Education Level</Label>
                          <Input
                            id="education"
                            value={formData.education}
                            onChange={(e) => handleInputChange("education", e.target.value)}
                            placeholder="Enter education level"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="psychographics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lifestyle & Psychology</CardTitle>
                      <CardDescription>Psychological attributes and behavioral patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="lifestyle">Lifestyle</Label>
                        <Textarea
                          id="lifestyle"
                          value={formData.lifestyle}
                          onChange={(e) => handleInputChange("lifestyle", e.target.value)}
                          placeholder="Describe the persona's lifestyle"
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Current Values</h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.psychographics.values.map((value, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Current Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.psychographics.interests.map((interest, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Campaign performance data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <Label htmlFor="cpl">CPL (Cost Per Lead)</Label>
                          <Input
                            id="cpl"
                            type="number"
                            step="0.01"
                            value={formData.cpl}
                            onChange={(e) => handleInputChange("cpl", parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="ctr">CTR (%)</Label>
                          <Input
                            id="ctr"
                            type="number"
                            step="0.1"
                            value={formData.ctr}
                            onChange={(e) => handleInputChange("ctr", parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                          <Input
                            id="conversionRate"
                            type="number"
                            step="0.1"
                            value={formData.conversionRate}
                            onChange={(e) => handleInputChange("conversionRate", parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="totalSpend">Total Spend</Label>
                          <Input
                            id="totalSpend"
                            type="number"
                            value={formData.totalSpend}
                            onChange={(e) => handleInputChange("totalSpend", parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="totalLeads">Total Leads</Label>
                          <Input
                            id="totalLeads"
                            type="number"
                            value={formData.totalLeads}
                            onChange={(e) => handleInputChange("totalLeads", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}