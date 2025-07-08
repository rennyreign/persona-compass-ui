import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, X, User, MapPin, Brain, Target, MessageSquare, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PersonaFormData {
  // Basic Info
  name: string;
  program: string;
  ageRange: string;
  careerStage: string;
  motivationalTagline: string;
  
  // Demographics
  location: string;
  income: string;
  education: string;
  
  // Psychographics
  values: string[];
  interests: string[];
  lifestyle: string;
  
  // Goals, Fears & Motivations
  goals: string[];
  fears: string[];
  motivations: string[];
  
  // Channels & Program Needs
  channels: string[];
  programNeeds: string[];
  
  // Visual Identity
  avatar: string;
  moodBoardImages: string[];
}

const initialFormData: PersonaFormData = {
  name: "",
  program: "",
  ageRange: "",
  careerStage: "",
  motivationalTagline: "",
  location: "",
  income: "",
  education: "",
  values: [],
  interests: [],
  lifestyle: "",
  goals: [],
  fears: [],
  motivations: [],
  channels: [],
  programNeeds: [],
  avatar: "",
  moodBoardImages: []
};

const steps = [
  { id: 1, title: "Basic Info", icon: User, description: "Core persona details" },
  { id: 2, title: "Demographics", icon: MapPin, description: "Statistical background" },
  { id: 3, title: "Psychographics", icon: Brain, description: "Values and lifestyle" },
  { id: 4, title: "Goals & Motivations", icon: Target, description: "Aspirations and drivers" },
  { id: 5, title: "Channels & Needs", icon: MessageSquare, description: "Communication preferences" },
  { id: 6, title: "Visual Identity", icon: Images, description: "Avatar and mood board" },
  { id: 7, title: "Review", icon: Check, description: "Final review" }
];

export default function CreatePersona() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PersonaFormData>(initialFormData);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const updateFormData = (field: keyof PersonaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof PersonaFormData, item: string) => {
    if (item.trim()) {
      const currentArray = formData[field] as string[];
      updateFormData(field, [...currentArray, item.trim()]);
      setNewItem("");
    }
  };

  const removeArrayItem = (field: keyof PersonaFormData, index: number) => {
    const currentArray = formData[field] as string[];
    updateFormData(field, currentArray.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // For now, just log the data - would integrate with Supabase for actual storage
    console.log("Creating persona:", formData);
    toast({
      title: "Persona Created!",
      description: `${formData.name} has been successfully created.`,
    });
    navigate("/");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Persona Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="e.g., Digital Native Dana"
                />
              </div>
              <div>
                <Label htmlFor="program">Program *</Label>
                <Select value={formData.program} onValueChange={(value) => updateFormData("program", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="Continuing Education">Continuing Education</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ageRange">Age Range *</Label>
                <Select value={formData.ageRange} onValueChange={(value) => updateFormData("ageRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-22">18-22</SelectItem>
                    <SelectItem value="23-27">23-27</SelectItem>
                    <SelectItem value="28-35">28-35</SelectItem>
                    <SelectItem value="36-45">36-45</SelectItem>
                    <SelectItem value="45-55">45-55</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="careerStage">Career Stage *</Label>
                <Select value={formData.careerStage} onValueChange={(value) => updateFormData("careerStage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select career stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate/Professional">Graduate/Professional</SelectItem>
                    <SelectItem value="Early Career">Early Career</SelectItem>
                    <SelectItem value="Mid-Career Professional">Mid-Career Professional</SelectItem>
                    <SelectItem value="Senior Professional">Senior Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="motivationalTagline">Motivational Tagline *</Label>
              <Input
                id="motivationalTagline"
                value={formData.motivationalTagline}
                onChange={(e) => updateFormData("motivationalTagline", e.target.value)}
                placeholder="e.g., Building tomorrow's tech solutions today"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                placeholder="e.g., Urban/Suburban Michigan"
              />
            </div>
            
            <div>
              <Label htmlFor="income">Income Range *</Label>
              <Select value={formData.income} onValueChange={(value) => updateFormData("income", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$0-25K">$0-25K</SelectItem>
                  <SelectItem value="$25K-50K">$25K-50K</SelectItem>
                  <SelectItem value="$50K-75K">$50K-75K</SelectItem>
                  <SelectItem value="$75K-100K">$75K-100K</SelectItem>
                  <SelectItem value="$100K-150K">$100K-150K</SelectItem>
                  <SelectItem value="$150K+">$150K+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="education">Education Level *</Label>
              <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Some College">Some College</SelectItem>
                  <SelectItem value="Current undergrad">Current undergrad</SelectItem>
                  <SelectItem value="Bachelor's degree">Bachelor's degree</SelectItem>
                  <SelectItem value="Bachelor's + work experience">Bachelor's + work experience</SelectItem>
                  <SelectItem value="Master's degree">Master's degree</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Core Values</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.values.map((value, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("values", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a core value"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("values", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("values", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {interest}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("interests", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add an interest"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("interests", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("interests", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="lifestyle">Lifestyle Description *</Label>
              <Textarea
                id="lifestyle"
                value={formData.lifestyle}
                onChange={(e) => updateFormData("lifestyle", e.target.value)}
                placeholder="e.g., Digital-first, highly connected"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Goals</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {goal}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("goals", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a goal"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("goals", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("goals", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Fears</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.fears.map((fear, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {fear}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("fears", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a fear"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("fears", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("fears", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Motivations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.motivations.map((motivation, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {motivation}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("motivations", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a motivation"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("motivations", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("motivations", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Preferred Channels</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.channels.map((channel, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {channel}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("channels", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a communication channel"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("channels", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("channels", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Program Requirements</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.programNeeds.map((need, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {need}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem("programNeeds", index)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add a program requirement"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("programNeeds", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("programNeeds", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => updateFormData("avatar", e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div>
              <Label>Mood Board Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {formData.moodBoardImages.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={image} alt={`Mood board ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeArrayItem("moodBoardImages", index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add image URL"
                  onKeyPress={(e) => e.key === "Enter" && addArrayItem("moodBoardImages", newItem)}
                />
                <Button type="button" onClick={() => addArrayItem("moodBoardImages", newItem)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Your Persona</h3>
              <p className="text-muted-foreground">Please review the information below before creating your persona.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Program:</strong> {formData.program}</p>
                  <p><strong>Age:</strong> {formData.ageRange}</p>
                  <p><strong>Career Stage:</strong> {formData.careerStage}</p>
                  <p><strong>Tagline:</strong> {formData.motivationalTagline}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Location:</strong> {formData.location}</p>
                  <p><strong>Income:</strong> {formData.income}</p>
                  <p><strong>Education:</strong> {formData.education}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Goals & Motivations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Goals:</strong> {formData.goals.length} items</p>
                  <p><strong>Fears:</strong> {formData.fears.length} items</p>
                  <p><strong>Motivations:</strong> {formData.motivations.length} items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Channels & Needs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Channels:</strong> {formData.channels.length} items</p>
                  <p><strong>Program Needs:</strong> {formData.programNeeds.length} items</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/89175e4f-021a-4be2-a013-b97ccb4af0c3.png" 
                    alt="MSU Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">MSU Persona</div>
                  <div className="text-xs text-muted-foreground">Intelligence Platform</div>
                </div>
              </a>
              <div className="w-px h-6 bg-border"></div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Create New Persona</h1>
                <p className="text-sm text-muted-foreground">Build a comprehensive persona profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center
                      ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                        isCurrent ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}
                    `}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-px mx-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button onClick={handleSubmit}>
              <Check className="w-4 h-4 mr-2" />
              Create Persona
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}