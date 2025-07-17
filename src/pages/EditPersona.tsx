import { useState, useEffect } from "react";
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
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "@/types/persona";

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
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    program_category: "",
    age_range: "",
    occupation: "",
    avatar_url: "",
    status: "active",
    location: "",
    income_range: "",
    education_level: "",
    industry: "",
    personality_traits: [] as string[],
    values: [] as string[],
    goals: [] as string[],
    pain_points: [] as string[],
    preferred_channels: [] as string[],
  });

  const [visualIdentityImages, setVisualIdentityImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching persona:', error);
        navigate('/');
        return;
      }
      
      if (!data) {
        navigate('/');
        return;
      }
      
      setPersona(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        program_category: data.program_category || "",
        age_range: data.age_range || "",
        occupation: data.occupation || "",
        avatar_url: data.avatar_url || "",
        status: data.status || "active",
        location: data.location || "",
        income_range: data.income_range || "",
        education_level: data.education_level || "",
        industry: data.industry || "",
        personality_traits: data.personality_traits || [],
        values: data.values || [],
        goals: data.goals || [],
        pain_points: data.pain_points || [],
        preferred_channels: data.preferred_channels || [],
      });
      setVisualIdentityImages(data.visual_identity_images || []);
      setLoading(false);
    };

    fetchPersona();
  }, [id, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!persona) return;
    
    const { error } = await supabase
      .from('personas')
      .update({
        name: formData.name,
        description: formData.description,
        program_category: formData.program_category,
        age_range: formData.age_range,
        occupation: formData.occupation,
        avatar_url: formData.avatar_url,
        status: formData.status,
        location: formData.location,
        income_range: formData.income_range,
        education_level: formData.education_level,
        industry: formData.industry,
        personality_traits: formData.personality_traits,
        values: formData.values,
        goals: formData.goals,
        pain_points: formData.pain_points,
        preferred_channels: formData.preferred_channels,
        visual_identity_images: visualIdentityImages,
      })
      .eq('id', persona.id);
      
    if (error) {
      console.error('Error updating persona:', error);
      toast({
        title: "Error",
        description: "Failed to update persona",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Persona updated successfully!",
      });
      navigate(`/persona/${id}`);
    }
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
    // Reset the input so the same files can be selected again
    event.target.value = '';
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
                          <Label htmlFor="program_category">Program Category</Label>
                          <Select
                            value={formData.program_category}
                            onValueChange={(value) => handleInputChange("program_category", value)}
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
                          <Label htmlFor="age_range">Age Range</Label>
                          <Select
                            value={formData.age_range}
                            onValueChange={(value) => handleInputChange("age_range", value)}
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
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter persona description"
                            rows={3}
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
                          <Label htmlFor="avatar_url">Avatar URL</Label>
                          <Input
                            id="avatar_url"
                            value={formData.avatar_url}
                            onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                            placeholder="Enter avatar image URL"
                          />
                        </div>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload new avatar image
                          </p>
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                handleInputChange("avatar", imageUrl);
                              }
                              // Reset the input so the same file can be selected again
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
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
                          <Label htmlFor="income_range">Income Range</Label>
                          <Input
                            id="income_range"
                            value={formData.income_range}
                            onChange={(e) => handleInputChange("income_range", e.target.value)}
                            placeholder="Enter income range"
                          />
                        </div>

                        <div>
                          <Label htmlFor="education_level">Education Level</Label>
                          <Input
                            id="education_level"
                            value={formData.education_level}
                            onChange={(e) => handleInputChange("education_level", e.target.value)}
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
                      <CardTitle>Psychological Attributes</CardTitle>
                      <CardDescription>Values, traits, and behavioral patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Edit personality traits, values, goals, and pain points for this persona.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>View campaign performance data in the main profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Performance metrics are automatically calculated from campaign data.
                      </p>
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