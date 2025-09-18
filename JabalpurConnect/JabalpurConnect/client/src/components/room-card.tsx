import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageCircle, Users, Wifi, Car, Utensils } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RoomListing } from "@shared/schema";

interface RoomCardProps {
  room: RoomListing;
  variant?: "grid" | "list";
}

export default function RoomCard({ room, variant = "grid" }: RoomCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConversationMutation = useMutation({
    mutationFn: async (ownerId: string) => {
      const response = await apiRequest("POST", "/api/conversations", {
        user1Id: user?.id,
        user2Id: ownerId
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
    createConversationMutation.mutate(room.ownerId);
  };

  const amenityIcons: { [key: string]: any } = {
    "WiFi": Wifi,
    "AC": "❄️",
    "Meals": Utensils,
    "Parking": Car,
    "Laundry": "🧺",
    "Security": "🔒",
    "Study Area": "📚",
    "Kitchen": "🍳"
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

  if (variant === "list") {
    return (
      <Card className="card-hover border border-border" data-testid={`room-card-${room.id}`}>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image */}
            <div className="w-48 h-32 flex-shrink-0">
              {room.images && room.images.length > 0 ? (
                <img 
                  src={room.images[0]} 
                  alt={room.title}
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
                <h3 className="font-semibold text-lg text-card-foreground">{room.title}</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">₹{room.rent.toLocaleString()}</span>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {room.description}
              </p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center star-rating">
                  {renderStars(room.rating || "0")}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {room.rating || "0"} ({room.reviewCount || 0} reviews)
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {room.roomType}
                </Badge>
                {room.amenities?.slice(0, 3).map((amenity) => {
                  const IconComponent = amenityIcons[amenity];
                  return (
                    <Badge key={amenity} variant="secondary">
                      {typeof IconComponent === "string" ? (
                        <span className="mr-1">{IconComponent}</span>
                      ) : IconComponent ? (
                        <IconComponent className="w-3 h-3 mr-1" />
                      ) : null}
                      {amenity}
                    </Badge>
                  );
                })}
                {room.amenities && room.amenities.length > 3 && (
                  <Badge variant="secondary">+{room.amenities.length - 3} more</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{room.area}, {room.location}</span>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleConnect}
                  disabled={createConversationMutation.isPending}
                  data-testid={`button-connect-${room.id}`}
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
    <Card className="card-hover border border-border overflow-hidden" data-testid={`room-card-${room.id}`}>
      {/* Image */}
      <div className="relative h-48">
        {room.images && room.images.length > 0 ? (
          <img 
            src={room.images[0]} 
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-foreground">
            {room.available ? "Available" : "Occupied"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">{room.title}</h3>
          <span className="text-xl font-bold text-primary">₹{room.rent.toLocaleString()}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {room.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center star-rating">
            {renderStars(room.rating || "0")}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            {room.rating || "0"} ({room.reviewCount || 0} reviews)
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">
            <Users className="w-3 h-3 mr-1" />
            {room.roomType}
          </Badge>
          {room.amenities?.slice(0, 2).map((amenity) => {
            const IconComponent = amenityIcons[amenity];
            return (
              <Badge key={amenity} variant="secondary">
                {typeof IconComponent === "string" ? (
                  <span className="mr-1">{IconComponent}</span>
                ) : IconComponent ? (
                  <IconComponent className="w-3 h-3 mr-1" />
                ) : null}
                {amenity}
              </Badge>
            );
          })}
          {room.amenities && room.amenities.length > 2 && (
            <Badge variant="secondary">+{room.amenities.length - 2}</Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{room.area}</span>
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleConnect}
            disabled={createConversationMutation.isPending}
            data-testid={`button-connect-${room.id}`}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
