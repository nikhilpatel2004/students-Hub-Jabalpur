import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Home as HomeIcon, Utensils, Search, MapPin, Users, Award, CheckCircle } from "lucide-react";
import RoomCard from "@/components/room-card";
import TiffinCard from "@/components/tiffin-card";
import MapView from "@/components/map-view";
import RequirementForm from "@/components/requirement-form";
import ChatInterface from "@/components/chat-interface";
import UserProfileCard from "@/components/user-profile-card";
import type { RoomListing, TiffinService } from "@shared/schema";

export default function Home() {
  const [searchTab, setSearchTab] = useState<"rooms" | "tiffin">("rooms");
  const [roomFilters, setRoomFilters] = useState({
    location: "",
    roomType: "",
    budget: ""
  });
  const [tiffinFilters, setTiffinFilters] = useState({
    deliveryArea: "",
    foodType: "",
    budget: ""
  });

  const { data: featuredRooms } = useQuery<RoomListing[]>({
    queryKey: ["/api/rooms"],
    select: (data) => data?.slice(0, 3) || []
  });

  const { data: featuredTiffin } = useQuery<TiffinService[]>({
    queryKey: ["/api/tiffin"],
    select: (data) => data?.slice(0, 3) || []
  });

  const handleRoomSearch = () => {
    const params = new URLSearchParams();
    if (roomFilters.location) params.set("location", roomFilters.location);
    if (roomFilters.roomType) params.set("roomType", roomFilters.roomType);
    if (roomFilters.budget) {
      const [min, max] = roomFilters.budget.split("-");
      if (min) params.set("minRent", min);
      if (max) params.set("maxRent", max);
    }
    window.location.href = `/rooms?${params.toString()}`;
  };

  const handleTiffinSearch = () => {
    const params = new URLSearchParams();
    if (tiffinFilters.deliveryArea) params.set("deliveryArea", tiffinFilters.deliveryArea);
    if (tiffinFilters.foodType) params.set("foodType", tiffinFilters.foodType);
    if (tiffinFilters.budget) params.set("maxPrice", tiffinFilters.budget);
    window.location.href = `/tiffin?${params.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your Perfect Stay & Tiffin in Jabalpur
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Connect with trusted PG owners, hostel providers, and tiffin services in one place
          </p>
          
          {/* Search Tabs */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="flex bg-white/20 rounded-xl p-1 mb-6">
              <button
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  searchTab === "rooms" ? "active-tab" : "hover:bg-white/10"
                }`}
                onClick={() => setSearchTab("rooms")}
                data-testid="tab-rooms"
              >
                <HomeIcon className="w-4 h-4 mr-2 inline" />
                Find Rooms
              </button>
              <button
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                  searchTab === "tiffin" ? "active-tab" : "hover:bg-white/10"
                }`}
                onClick={() => setSearchTab("tiffin")}
                data-testid="tab-tiffin"
              >
                <Utensils className="w-4 h-4 mr-2 inline" />
                Find Tiffin
              </button>
            </div>
            
            {/* Room Search Form */}
            {searchTab === "rooms" && (
              <div className="space-y-4" data-testid="rooms-search">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Select value={roomFilters.location} onValueChange={(value) => setRoomFilters(prev => ({ ...prev, location: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wright-town">Wright Town</SelectItem>
                        <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
                        <SelectItem value="napier-town">Napier Town</SelectItem>
                        <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <Select value={roomFilters.roomType} onValueChange={(value) => setRoomFilters(prev => ({ ...prev, roomType: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-room-type">
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (₹/month)</label>
                    <Select value={roomFilters.budget} onValueChange={(value) => setRoomFilters(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-budget">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-3000">Under ₹3,000</SelectItem>
                        <SelectItem value="3000-5000">₹3,000 - ₹5,000</SelectItem>
                        <SelectItem value="5000-8000">₹5,000 - ₹8,000</SelectItem>
                        <SelectItem value="8000-999999">Above ₹8,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  onClick={handleRoomSearch}
                  data-testid="button-search-rooms"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Rooms
                </Button>
              </div>
            )}
            
            {/* Tiffin Search Form */}
            {searchTab === "tiffin" && (
              <div className="space-y-4" data-testid="tiffin-search">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Area</label>
                    <Select value={tiffinFilters.deliveryArea} onValueChange={(value) => setTiffinFilters(prev => ({ ...prev, deliveryArea: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-delivery-area">
                        <SelectValue placeholder="Select delivery area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wright-town">Wright Town</SelectItem>
                        <SelectItem value="south-civil-lines">South Civil Lines</SelectItem>
                        <SelectItem value="napier-town">Napier Town</SelectItem>
                        <SelectItem value="russell-chowk">Russell Chowk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Food Type</label>
                    <Select value={tiffinFilters.foodType} onValueChange={(value) => setTiffinFilters(prev => ({ ...prev, foodType: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-food-type">
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (₹/month)</label>
                    <Select value={tiffinFilters.budget} onValueChange={(value) => setTiffinFilters(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger className="bg-white text-gray-800" data-testid="select-tiffin-budget">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2000">Under ₹2,000</SelectItem>
                        <SelectItem value="3000">₹2,000 - ₹3,000</SelectItem>
                        <SelectItem value="4000">₹3,000 - ₹4,000</SelectItem>
                        <SelectItem value="999999">Above ₹4,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  onClick={handleTiffinSearch}
                  data-testid="button-search-tiffin"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Tiffin Services
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-rooms">
              <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">Verified Rooms</div>
            </div>
            <div data-testid="stat-tiffin">
              <div className="text-3xl font-bold text-secondary mb-2">350+</div>
              <div className="text-muted-foreground">Tiffin Providers</div>
            </div>
            <div data-testid="stat-students">
              <div className="text-3xl font-bold text-accent mb-2">8,500+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div data-testid="stat-areas">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Areas Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 md:mb-0">Featured Rooms & PGs</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" data-testid="filter-all-rooms">All</Button>
              <Button variant="outline" size="sm" data-testid="filter-single">Single</Button>
              <Button variant="outline" size="sm" data-testid="filter-double">Double</Button>
              <Button variant="outline" size="sm" data-testid="filter-private">Private</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-rooms">
            {featuredRooms?.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" data-testid="button-view-all-rooms">
              View All Rooms <Search className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tiffin Services */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-4 md:mb-0">Popular Tiffin Services</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" data-testid="filter-all-tiffin">All</Button>
              <Button variant="outline" size="sm" data-testid="filter-veg">Vegetarian</Button>
              <Button variant="outline" size="sm" data-testid="filter-non-veg">Non-Veg</Button>
              <Button variant="outline" size="sm" data-testid="filter-jain">Jain</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-tiffin">
            {featuredTiffin?.map((service) => (
              <TiffinCard key={service.id} service={service} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" data-testid="button-view-all-tiffin">
              View All Tiffin Services <Search className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Locations in Jabalpur</h2>
            <p className="text-muted-foreground text-lg">
              Find rooms and tiffin services near your college or preferred area
            </p>
          </div>
          
          <MapView />
        </div>
      </section>

      {/* Post Requirement Section */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">Post Your Requirement</h2>
            <p className="text-muted-foreground text-lg">
              Can't find what you're looking for? Post your requirement and let providers reach out to you
            </p>
          </div>
          
          <RequirementForm />
        </div>
      </section>

      {/* Messaging Interface */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">In-App Messaging System</h2>
            <p className="text-muted-foreground text-lg">
              Connect directly with room owners and tiffin providers through our secure messaging platform
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </section>

      {/* User Profiles Preview */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">User Profiles</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive profiles for students, room owners, and tiffin providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserProfileCard 
              type="student" 
              name="Rahul Sharma" 
              subtitle="IIITDM Jabalpur - B.Tech CSE" 
              data-testid="profile-student"
            />
            <UserProfileCard 
              type="room_owner" 
              name="Amit Singh" 
              subtitle="Comfort PG Owner" 
              data-testid="profile-owner"
            />
            <UserProfileCard 
              type="tiffin_provider" 
              name="Maa Ki Rasoi" 
              subtitle="Home-style Tiffin Service" 
              data-testid="profile-provider"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
