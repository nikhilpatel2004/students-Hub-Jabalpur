import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, MessageCircle, Truck, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TiffinService } from "@shared/schema";

interface TiffinCardProps {
  service: TiffinService;
  variant?: "grid" | "list";
}

export default function TiffinCard({ service, variant = "grid" }: TiffinCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConversationMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await apiRequest("POST", "/api/conversations", {
        user1Id: user?.id,
        user2Id: providerId
      });
      return response.json();
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "conversations"] });
      window.location.href = `/messages?conversation=${conversation.id}`;
    },
    onError: () => {
      toast({ title: "Error starting conversation", variant: "destructive" });
    }
  });

  const handleConnect = () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    createConversationMutation.mutate(service.providerId);
  };

  const renderStars = (rating: string) => {
    const stars = [];
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-current text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(ratingNum);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const getFoodTypeBadge = (foodType: string) => {
    const badges = {
      "vegetarian": { variant: "default" as const, color: "bg-accent text-accent-foreground", label: "Vegetarian" },
      "non_vegetarian": { variant: "destructive" as const, color: "", label: "Non-Veg" },
      "both": { variant: "secondary" as const, color: "", label: "Both" },
      "jain": { variant: "outline" as const, color: "", label: "Jain" }
    };
    
    return badges[foodType as keyof typeof badges] || badges.vegetarian;
  };

  if (variant === "list") {
    return (
      <Card className="card-hover border border-border" data-testid={`tiffin-card-${service.id}`}>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image */}
            <div className="w-48 h-32 flex-shrink-0">
              {service.images && service.images.length > 0 ? (
                <img 
                  src={service.images[0]} 
                  alt={service.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-card-foreground">{service.name}</h3>
                  <Badge {...getFoodTypeBadge(service.foodType)}>
                    {getFoodTypeBadge(service.foodType).label}
                  </Badge>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center star-rating">
                  {renderStars(service.rating || "0")}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {service.rating || "0"} ({service.reviewCount || 0} reviews)
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Lunch:</span>
                  <span className="font-medium text-foreground ml-1">
                    {service.lunchPrice ? `₹${service.lunchPrice}` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dinner:</span>
                  <span className="font-medium text-foreground ml-1">
                    {service.dinnerPrice ? `₹${service.dinnerPrice}` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <span className="font-medium text-secondary ml-1">₹{service.monthlyPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium text-accent ml-1">
                    {service.deliveryFee === 0 ? "Free" : `₹${service.deliveryFee}`}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{service.deliveryAreas?.join(", ")}</span>
                </div>
                <Button 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={handleConnect}
                  disabled={createConversationMutation.isPending}
                  data-testid={`button-connect-${service.id}`}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover border border-border overflow-hidden" data-testid={`tiffin-card-${service.id}`}>
      {/* Image */}
      <div className="relative h-48">
        {service.images && service.images.length > 0 ? (
          <img 
            src={service.images[0]} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge {...getFoodTypeBadge(service.foodType)}>
            {getFoodTypeBadge(service.foodType).label}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">{service.name}</h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center star-rating">
            {renderStars(service.rating || "0")}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            {service.rating || "0"} ({service.reviewCount || 0} reviews)
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-muted-foreground">Lunch:</span>
            <span className="font-medium text-foreground ml-1">
              {service.lunchPrice ? `₹${service.lunchPrice}` : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Dinner:</span>
            <span className="font-medium text-foreground ml-1">
              {service.dinnerPrice ? `₹${service.dinnerPrice}` : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Monthly:</span>
            <span className="font-medium text-secondary ml-1">₹{service.monthlyPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Delivery:</span>
            <span className="font-medium text-accent ml-1">
              {service.deliveryFee === 0 ? "Free" : `₹${service.deliveryFee}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{service.deliveryAreas?.[0] || "N/A"}</span>
          </div>
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={handleConnect}
            disabled={createConversationMutation.isPending}
            data-testid={`button-connect-${service.id}`}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
