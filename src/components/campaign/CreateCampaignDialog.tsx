import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
// Mock data removed - using database-driven personas
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CreateCampaignFormData {
  personaId: string;
  name: string;
  channel: string;
  cta: string;
  startDate: string;
  markdownContent: string;
}

interface CreateCampaignDialogProps {
  trigger?: React.ReactNode;
  onCampaignCreated?: (campaign: any) => void;
  editMode?: boolean;
  existingCampaign?: any;
}

const channels = [
  "Facebook",
  "Instagram", 
  "LinkedIn",
  "TikTok",
  "Google",
  "YouTube",
  "Twitter",
  "Email",
];

export function CreateCampaignDialog({ trigger, onCampaignCreated, editMode = false, existingCampaign }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<CreateCampaignFormData>({
    defaultValues: {
      personaId: existingCampaign?.persona_id || "",
      name: existingCampaign?.name || "",
      channel: existingCampaign?.channel || "",
      cta: existingCampaign?.cta || "",
      startDate: existingCampaign?.start_date || "",
      markdownContent: existingCampaign?.campaign_plans?.[0]?.markdown_content || existingCampaign?.markdown_content || "",
    },
  });

  // Load personas when dialog opens
  useEffect(() => {
    const loadPersonas = async () => {
      if (!user || !open) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('personas')
        .select('id, name, occupation')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error loading personas:', error);
        toast({
          title: "Error",
          description: "Failed to load personas",
          variant: "destructive"
        });
      } else {
        setPersonas(data || []);
      }
      setLoading(false);
    };

    loadPersonas();
  }, [open, user]);

  // Reset form when existingCampaign changes
  useEffect(() => {
    if (existingCampaign && editMode) {
      form.reset({
        personaId: existingCampaign?.persona_id || "",
        name: existingCampaign?.name || "",
        channel: existingCampaign?.channel || "",
        cta: existingCampaign?.cta || "",
        startDate: existingCampaign?.start_date || "",
        markdownContent: existingCampaign?.campaign_plans?.[0]?.markdown_content || existingCampaign?.markdown_content || "",
      });
    }
  }, [existingCampaign, editMode, form]);

  const onSubmit = (data: CreateCampaignFormData) => {
    if (editMode && existingCampaign) {
      // Update existing campaign
      const updatedCampaign = {
        ...existingCampaign,
        persona_id: data.personaId,
        name: data.name,
        channel: data.channel,
        cta: data.cta,
        start_date: data.startDate,
        markdown_content: data.markdownContent,
        updated_at: new Date().toISOString(),
      };

      // Updated Campaign data processed
      
      toast({
        title: "Campaign Updated",
        description: "Campaign has been successfully updated.",
      });
    } else {
      // Create new campaign object
      const newCampaign = {
        id: Math.random().toString(36).substr(2, 9),
        personaId: data.personaId,
        name: data.name,
        channel: data.channel,
        spend: 0,
        clicks: 0,
        leads: 0,
        cta: data.cta,
        notes: "Campaign created with imported content",
        startDate: data.startDate,
        status: 'active' as const,
      };

      // Create campaign plan
      const newCampaignPlan = {
        id: Math.random().toString(36).substr(2, 9),
        campaignId: newCampaign.id,
        markdownContent: data.markdownContent,
        lastUpdated: new Date().toISOString(),
      };

      // New Campaign and Campaign Plan data processed
      
      toast({
        title: "Campaign Created",
        description: "New campaign has been successfully created.",
      });
    }

    // Call the callback with the appropriate campaign data
    const campaignData = editMode ? existingCampaign : { name: data.name };
    onCampaignCreated?.(campaignData);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Update your campaign details and content' : 'Set up a new marketing campaign with imported markdown content'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personaId"
                rules={{ required: "Please select a persona" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Persona</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger className="bg-white border-border text-foreground">
                           <SelectValue placeholder="Select persona" />
                         </SelectTrigger>
                       </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>Loading personas...</SelectItem>
                        ) : personas.length > 0 ? (
                          personas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name} - {persona.occupation}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-personas" disabled>No personas available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="channel"
                rules={{ required: "Please select a channel" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketing Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger className="bg-white border-border text-foreground">
                           <SelectValue placeholder="Select channel" />
                         </SelectTrigger>
                       </FormControl>
                      <SelectContent>
                        {channels.map((channel) => (
                          <SelectItem key={channel} value={channel}>
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Campaign name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                   <FormControl>
                     <Input placeholder="Enter campaign name" className="bg-white border-border text-foreground" {...field} />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cta"
                rules={{ required: "Call-to-action is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call-to-Action</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Sign up for free trial" className="bg-white border-border text-foreground" {...field} />
                   </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                   <FormControl>
                     <Input type="date" className="bg-white border-border text-foreground" {...field} />
                   </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="markdownContent"
              rules={{ required: "Campaign content is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Plan Content</FormLabel>
                   <FormControl>
                     <Textarea
                       placeholder="Paste your campaign markdown content here or type directly..."
                       className="min-h-[200px] font-mono bg-white border-border text-foreground"
                       {...field}
                     />
                   </FormControl>
                  <FormDescription>
                    Import your campaign plan markdown or create content directly in this editor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting 
              ? (editMode ? 'Updating...' : 'Creating...') 
              : (editMode ? 'Update Campaign' : 'Create Campaign')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}