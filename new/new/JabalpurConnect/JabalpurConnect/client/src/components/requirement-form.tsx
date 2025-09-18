import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Utensils, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RequirementForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requirementType, setRequirementType] = useState<"room" | "tiffin">("room");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    acceptNotifications: false
  });

  const createRequirementMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/requirements", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Requirement posted successfully!" });
      // Reset form
      setFormData({
        name: user?.name || "",
        college: user?.college || "",
        location: "",
        budgetMin: "",
        budgetMax: "",
        description: "",
        acceptNotifications: false
      });
      queryClient.invalidateQueries({ queryKey: ["/api/requirements"] });
    },
    onError: () => {
      toast({ title: "Error posting requirement", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (!formData.name || !formData.location || !formData.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createRequirementMutation.mutate({
      studentId: user.id,
      type: requirementType,
      location: formData.location,
      budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
      description: formData.description
    });
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-background shadow-sm border border-border" data-testid="requirement-form">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requirement Type */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-3">What are you looking for?</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRequirementType("room")}
                className={`flex-1 border-2 rounded-lg p-4 text-left cursor-pointer hover:bg-primary/10 transition-colors ${
                  requirementType === "room" 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border bg-card text-muted-foreground"
                }`}
                data-testid="select-room-requirement"
              >
                <div className="flex items-center">
                  <Home className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-medium">Room/PG</div>
                    <div className="text-sm opacity-70">Looking for accommodation</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setRequirementType("tiffin")}
                className={`flex-1 border-2 rounded-lg p-4 text-left cursor-pointer hover:bg-secondary/10 transition-colors ${
                  requirementType === "tiffin" 
                    ? "border-secondary bg-secondary/5 text-secondary" 
                    : "border-border bg-card text-muted-foreground"
                }`}
                data-testid="select-tiffin-requirement"
              >
                <div className="flex items-center">
                  <Utensils className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-medium">Tiffin Service</div>
                    <div className="text-sm opacity-70">Looking for meal service</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                required
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="college">College/University</Label>
              <Input
                id="college"
                placeholder="e.g., IIITDM Jabalpur"
                value={formData.college}
                onChange={(e) => updateFormData("college", e.target.value)}
                data-testid="input-college"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="location">Preferred Location *</Label>
              <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Select preferred location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wright-town">Wright Town</SelectItem>
                  <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
                  <SelectItem value="napier-town">Napier Town</SelectItem>
                  <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
                  <SelectItem value="khamaria">Khamaria</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Budget Range (₹/month)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min budget"
                  value={formData.budgetMin}
                  onChange={(e) => updateFormData("budgetMin", e.target.value)}
                  data-testid="input-budget-min"
                />
                <Input
                  type="number"
                  placeholder="Max budget"
                  value={formData.budgetMax}
                  onChange={(e) => updateFormData("budgetMax", e.target.value)}
                  data-testid="input-budget-max"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Additional Requirements *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe your specific needs, preferences, or any other requirements..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              required
              data-testid="textarea-description"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={formData.acceptNotifications}
              onCheckedChange={(checked) => updateFormData("acceptNotifications", checked)}
              data-testid="checkbox-notifications"
            />
            <Label htmlFor="notifications" className="text-sm text-muted-foreground">
              I agree to receive notifications from relevant providers
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            disabled={createRequirementMutation.isPending}
            data-testid="button-submit-requirement"
          >
            {createRequirementMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Post Requirement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
