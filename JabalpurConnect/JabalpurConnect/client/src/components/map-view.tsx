import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Home, Utensils, Navigation } from "lucide-react";

export default function MapView() {
  const [selectedArea, setSelectedArea] = useState("all");
  const [showRooms, setShowRooms] = useState(true);
  const [showTiffin, setShowTiffin] = useState(true);

  return (
    <Card className="overflow-hidden shadow-sm border border-border" data-testid="map-view">
      {/* Map Container */}
      <div className="map-container h-96 relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground max-w-md">
              Google Maps integration will show PG locations and tiffin centers. 
              Use the environment variable VITE_GOOGLE_MAPS_API_KEY to enable maps.
            </p>
          </div>
        </div>
        
        {/* Simulated Map Pins */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" data-testid="map-pin-room-1">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" data-testid="map-pin-tiffin-1">
          <Utensils className="w-4 h-4 text-white" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" data-testid="map-pin-room-2">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" data-testid="map-pin-tiffin-2">
          <Utensils className="w-4 h-4 text-white" />
        </div>
        <div className="absolute bottom-1/4 right-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform" data-testid="map-pin-room-3">
          <Home className="w-4 h-4 text-white" />
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
              <span>Rooms & PGs</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-secondary rounded-full mr-2"></div>
              <span>Tiffin Services</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="icon" className="bg-white" data-testid="map-zoom-in">
            +
          </Button>
          <Button variant="outline" size="icon" className="bg-white" data-testid="map-zoom-out">
            -
          </Button>
          <Button variant="outline" size="icon" className="bg-white" data-testid="map-my-location">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Map Controls */}
      <CardContent className="p-4 bg-card border-t border-border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-rooms"
                checked={showRooms}
                onCheckedChange={setShowRooms}
                data-testid="checkbox-show-rooms"
              />
              <Label htmlFor="show-rooms" className="flex items-center text-sm">
                <Home className="w-4 h-4 text-primary mr-1" />
                Rooms & PGs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-tiffin"
                checked={showTiffin}
                onCheckedChange={setShowTiffin}
                data-testid="checkbox-show-tiffin"
              />
              <Label htmlFor="show-tiffin" className="flex items-center text-sm">
                <Utensils className="w-4 h-4 text-secondary mr-1" />
                Tiffin Services
              </Label>
            </div>
          </div>
          
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-48" data-testid="select-map-area">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="wright-town">Wright Town</SelectItem>
              <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
              <SelectItem value="napier-town">Napier Town</SelectItem>
              <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
              <SelectItem value="khamaria">Khamaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>💡 Click on the pins to view details. Use zoom controls to navigate the map.</p>
        </div>
      </CardContent>
    </Card>
  );
}
