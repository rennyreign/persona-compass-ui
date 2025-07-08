import { useState } from "react";
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
import { mockPersonas } from "@/data/mockData";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export function CreateCampaignDialog({ trigger, onCampaignCreated }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CreateCampaignFormData>({
    defaultValues: {
      personaId: "",
      name: "",
      channel: "",
      cta: "",
      startDate: "",
      markdownContent: "",
    },
  });

  const onSubmit = (data: CreateCampaignFormData) => {
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

    // Here you would normally save to your backend
    console.log('New Campaign:', newCampaign);
    console.log('Campaign Plan:', newCampaignPlan);

    toast({
      title: "Campaign Created",
      description: `Campaign "${data.name}" has been created successfully.`,
    });

    onCampaignCreated?.(newCampaign);
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
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign with imported markdown content
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select persona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockPersonas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id}>
                            {persona.name}
                          </SelectItem>
                        ))}
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
                        <SelectTrigger>
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
                    <Input placeholder="Enter campaign name" {...field} />
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
                      <Input placeholder="e.g., Sign up for free trial" {...field} />
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
                      <Input type="date" {...field} />
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
                      className="min-h-[200px] font-mono"
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Create Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}