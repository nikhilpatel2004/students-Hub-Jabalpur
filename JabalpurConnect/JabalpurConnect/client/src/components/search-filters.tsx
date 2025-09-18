import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface SearchFiltersProps {
  type: "rooms" | "tiffin";
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilters({ type, filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    if (type === "rooms") {
      onFiltersChange({
        location: "",
        roomType: "",
        minRent: "",
        maxRent: "",
        amenities: []
      });
    } else {
      onFiltersChange({
        deliveryArea: "",
        foodType: "",
        maxPrice: "",
        features: []
      });
    }
  };

  if (type === "rooms") {
    return (
      <Card data-testid="search-filters-rooms">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
              <SelectTrigger data-testid="filter-location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wright-town">Wright Town</SelectItem>
                <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
                <SelectItem value="napier-town">Napier Town</SelectItem>
                <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
                <SelectItem value="khamaria">Khamaria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label>Room Type</Label>
            <Select value={filters.roomType} onValueChange={(value) => updateFilter("roomType", value)}>
              <SelectTrigger data-testid="filter-room-type">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Sharing</SelectItem>
                <SelectItem value="double">Double Sharing</SelectItem>
                <SelectItem value="triple">Triple Sharing</SelectItem>
                <SelectItem value="private">Private Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <Label>Price Range (₹/month)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minRent" className="text-sm">Min</Label>
                <Input
                  id="minRent"
                  type="number"
                  placeholder="Min rent"
                  value={filters.minRent}
                  onChange={(e) => updateFilter("minRent", e.target.value)}
                  data-testid="filter-min-rent"
                />
              </div>
              <div>
                <Label htmlFor="maxRent" className="text-sm">Max</Label>
                <Input
                  id="maxRent"
                  type="number"
                  placeholder="Max rent"
                  value={filters.maxRent}
                  onChange={(e) => updateFilter("maxRent", e.target.value)}
                  data-testid="filter-max-rent"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="space-y-2">
              {["WiFi", "AC", "Meals", "Laundry", "Parking", "Security", "Study Area", "Kitchen"].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={filters.amenities?.includes(amenity)}
                    onCheckedChange={() => toggleArrayFilter("amenities", amenity)}
                    data-testid={`filter-amenity-${amenity.toLowerCase()}`}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="search-filters-tiffin">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Area */}
        <div className="space-y-2">
          <Label>Delivery Area</Label>
          <Select value={filters.deliveryArea} onValueChange={(value) => updateFilter("deliveryArea", value)}>
            <SelectTrigger data-testid="filter-delivery-area">
              <SelectValue placeholder="Select delivery area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wright-town">Wright Town</SelectItem>
              <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
              <SelectItem value="napier-town">Napier Town</SelectItem>
              <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
              <SelectItem value="khamaria">Khamaria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Food Type */}
        <div className="space-y-2">
          <Label>Food Type</Label>
          <Select value={filters.foodType} onValueChange={(value) => updateFilter("foodType", value)}>
            <SelectTrigger data-testid="filter-food-type">
              <SelectValue placeholder="Select food type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="jain">Jain Food</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Max Price */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Monthly Price (₹)</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Maximum price"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            data-testid="filter-max-price"
          />
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-3">
          <Label>Features</Label>
          <div className="space-y-2">
            {["Free Delivery", "Trial Available", "Custom Menu", "Organic", "Special Diet"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={filters.features?.includes(feature)}
                  onCheckedChange={() => toggleArrayFilter("features", feature)}
                  data-testid={`filter-feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <Label htmlFor={`feature-${feature}`} className="text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
