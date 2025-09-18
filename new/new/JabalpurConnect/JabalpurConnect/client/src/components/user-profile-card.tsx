import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GraduationCap, Building, Utensils } from "lucide-react";

interface UserProfileCardProps {
  type: "student" | "room_owner" | "tiffin_provider";
  name: string;
  subtitle: string;
  [key: string]: any;
}

export default function UserProfileCard({ type, name, subtitle, ...props }: UserProfileCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "student":
        return <GraduationCap className="w-6 h-6" />;
      case "room_owner":
        return <Building className="w-6 h-6" />;
      case "tiffin_provider":
        return <Utensils className="w-6 h-6" />;
      default:
        return <GraduationCap className="w-6 h-6" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "student":
        return "bg-primary text-primary-foreground";
      case "room_owner":
        return "bg-secondary text-secondary-foreground";
      case "tiffin_provider":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "student":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "room_owner":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/90";
      case "tiffin_provider":
        return "bg-accent text-accent-foreground hover:bg-accent/90";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };

  const renderProfileContent = () => {
    if (type === "student") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Budget Preference</label>
            <p className="text-muted-foreground">₹3,000 - ₹5,000/month</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Food Preference</label>
            <p className="text-muted-foreground">Vegetarian</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Preferred Areas</label>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">Wright Town</Badge>
              <Badge variant="outline">Civil Lines</Badge>
            </div>
          </div>
        </div>
      );
    }

    if (type === "room_owner") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Total Rooms</label>
            <p className="text-muted-foreground">12 rooms (8 occupied)</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Location</label>
            <p className="text-muted-foreground">Wright Town, Jabalpur</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">AC</Badge>
              <Badge variant="outline">WiFi</Badge>
              <Badge variant="outline">Meals</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Rating</label>
            <div className="flex items-center mt-1">
              <div className="flex star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">4.8 (45 reviews)</span>
            </div>
          </div>
        </div>
      );
    }

    if (type === "tiffin_provider") {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Speciality</label>
            <p className="text-muted-foreground">Vegetarian Homestyle Meals</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Delivery Areas</label>
            <p className="text-muted-foreground">Wright Town, Civil Lines</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Monthly Plan</label>
            <p className="text-muted-foreground">₹2,800 (Lunch + Dinner)</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Rating</label>
            <div className="flex items-center mt-1">
              <div className="flex star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">4.8 (156 reviews)</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const getButtonText = () => {
    switch (type) {
      case "student":
        return "Edit Profile";
      case "room_owner":
        return "Manage Listings";
      case "tiffin_provider":
        return "Update Menu";
      default:
        return "Edit Profile";
    }
  };

  return (
    <Card className="bg-background shadow-sm border border-border" {...props}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <Avatar className={`w-20 h-20 mx-auto mb-4 ${getTypeColor()}`}>
            <AvatarFallback className={getTypeColor()}>
              {getTypeIcon()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        
        {renderProfileContent()}
        
        <Button 
          className={`w-full mt-6 font-medium ${getButtonColor()}`}
          data-testid={`button-${type.replace('_', '-')}`}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
