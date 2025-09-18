import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Grid, List } from "lucide-react";
import TiffinCard from "@/components/tiffin-card";
import SearchFilters from "@/components/search-filters";
import type { TiffinService } from "@shared/schema";

export default function Tiffin() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    deliveryArea: "",
    foodType: "",
    maxPrice: "",
    features: [] as string[]
  });

  const { data: services, isLoading } = useQuery<TiffinService[]>({
    queryKey: ["/api/tiffin", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.deliveryArea) params.set("deliveryArea", filters.deliveryArea);
      if (filters.foodType) params.set("foodType", filters.foodType);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      
      const response = await fetch(`/api/tiffin?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch tiffin services");
      return response.json();
    }
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Tiffin Services</h1>
              <p className="text-muted-foreground">
                {services?.length || 0} tiffin services available in Jabalpur
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              type="tiffin"
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {Object.values(filters).some(filter => 
              Array.isArray(filter) ? filter.length > 0 : filter !== ""
            ) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.deliveryArea && (
                    <Badge variant="secondary" data-testid="filter-badge-delivery-area">
                      Area: {filters.deliveryArea}
                    </Badge>
                  )}
                  {filters.foodType && (
                    <Badge variant="secondary" data-testid="filter-badge-food-type">
                      Type: {filters.foodType}
                    </Badge>
                  )}
                  {filters.maxPrice && (
                    <Badge variant="secondary" data-testid="filter-badge-max-price">
                      Under ₹{filters.maxPrice}
                    </Badge>
                  )}
                  {filters.features.map((feature) => (
                    <Badge key={feature} variant="secondary" data-testid={`filter-badge-feature-${feature}`}>
                      {feature}
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      deliveryArea: "",
                      foodType: "",
                      maxPrice: "",
                      features: []
                    })}
                    data-testid="button-clear-filters"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {isLoading ? (
              <div className="text-center py-12" data-testid="loading-tiffin">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading tiffin services...</p>
              </div>
            ) : services?.length === 0 ? (
              <Card className="text-center py-12" data-testid="no-tiffin-found">
                <CardContent>
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tiffin services found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search in a different area
                  </p>
                  <Button onClick={() => setFilters({
                    deliveryArea: "",
                    foodType: "",
                    maxPrice: "",
                    features: []
                  })}>
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`} data-testid="tiffin-list">
                {services?.map((service) => (
                  <TiffinCard key={service.id} service={service} variant={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {services && services.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <Button variant="outline" disabled data-testid="button-prev-page">
                    Previous
                  </Button>
                  <Button variant="default" data-testid="button-page-1">1</Button>
                  <Button variant="outline" data-testid="button-page-2">2</Button>
                  <Button variant="outline" data-testid="button-page-3">3</Button>
                  <Button variant="outline" data-testid="button-next-page">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
