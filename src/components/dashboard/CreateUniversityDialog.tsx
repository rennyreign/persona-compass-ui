import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateUniversityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUniversityCreated: () => void;
}

export function CreateUniversityDialog({
  open,
  onOpenChange,
  onUniversityCreated,
}: CreateUniversityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    domain: "",
    primaryColor: "#253746",
    secondaryColor: "#3291d9",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          subdomain: formData.subdomain,
          domain: formData.domain || null,
          primary_color: formData.primaryColor,
          secondary_color: formData.secondaryColor,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "University created",
        description: "The university has been successfully created.",
      });

      onUniversityCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        subdomain: "",
        domain: "",
        primaryColor: "#253746",
        secondaryColor: "#3291d9",
      });
    } catch (error) {
      console.error('Error creating university:', error);
      toast({
        title: "Error",
        description: "Failed to create university. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New University</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">University Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Arizona State University"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain *</Label>
            <Input
              id="subdomain"
              value={formData.subdomain}
              onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
              placeholder="e.g., asu"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used for university-specific URLs
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="e.g., asu.edu"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <Input
                id="secondaryColor"
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create University"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}