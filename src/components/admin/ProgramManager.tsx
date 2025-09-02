import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, X } from "lucide-react";

interface ProgramManagerProps {
  selectedOrganization: string;
  showAddDialog?: boolean;
  onClose?: () => void;
}

export function ProgramManager({ selectedOrganization, showAddDialog, onClose }: ProgramManagerProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    target_audience: '',
    key_benefits: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage programs.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim() || !formData.category.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const keyBenefits = formData.key_benefits
        .split('\n')
        .map(benefit => benefit.trim())
        .filter(benefit => benefit.length > 0);

      const programData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        target_audience: formData.target_audience.trim(),
        key_benefits: keyBenefits,
        organization_id: selectedOrganization,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('programs')
        .insert(programData)
        .select();

      if (error) {
        console.error('Error saving program:', error);
        toast({
          title: "Error",
          description: "Failed to create program. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Program created successfully.",
      });

      resetForm();
      onClose?.();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      target_audience: '',
      key_benefits: ''
    });
  };

  return (
    <Dialog open={showAddDialog || false} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add New Program
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Supply Chain Management Certificate"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supply Chain Management">Supply Chain Management</SelectItem>
                  <SelectItem value="Management and Leadership">Management and Leadership</SelectItem>
                  <SelectItem value="Human Capital Management">Human Capital Management</SelectItem>
                  <SelectItem value="Marketing and Analytics">Marketing and Analytics</SelectItem>
                  <SelectItem value="Technology Management">Technology Management</SelectItem>
                  <SelectItem value="Healthcare Management">Healthcare Management</SelectItem>
                  <SelectItem value="Finance and Accounting">Finance and Accounting</SelectItem>
                  <SelectItem value="Professional Development">Professional Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the program..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
              placeholder="e.g., Mid-level managers with 3+ years experience"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key_benefits">Key Benefits (one per line)</Label>
            <Textarea
              id="key_benefits"
              value={formData.key_benefits}
              onChange={(e) => setFormData(prev => ({ ...prev, key_benefits: e.target.value }))}
              placeholder="Strategic thinking skills\nLeadership development\nNetworking opportunities"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose?.();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Create Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
