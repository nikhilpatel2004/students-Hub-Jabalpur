import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, X, Plus, Home, Utensils, MessageSquare, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User as UserType, RoomListing, TiffinService, Requirement } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    college: user?.college || "",
  });

  const { data: userRooms } = useQuery<RoomListing[]>({
    queryKey: ["/api/users", user?.id, "rooms"],
    enabled: !!user?.id && user?.userType === "room_owner"
  });

  const { data: userTiffin } = useQuery<TiffinService[]>({
    queryKey: ["/api/users", user?.id, "tiffin"],
    enabled: !!user?.id && user?.userType === "tiffin_provider"
  });

  const { data: userRequirements } = useQuery<Requirement[]>({
    queryKey: ["/api/users", user?.id, "requirements"],
    enabled: !!user?.id && user?.userType === "student"
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserType>) => {
      const response = await apiRequest("PUT", `/api/users/${user?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id] });
    },
    onError: () => {
      toast({ title: "Error updating profile", variant: "destructive" });
    }
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      college: user?.college || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md" data-testid="auth-required">
          <CardContent className="pt-6 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in to view profile</h3>
            <p className="text-muted-foreground mb-4">
              Create your profile to get started
            </p>
            <Button data-testid="button-sign-in">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card data-testid="profile-info">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      data-testid="button-edit-profile"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        data-testid="button-cancel-edit"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        data-testid="button-save-profile"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.profileImage || ""} />
                    <AvatarFallback className="text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="mb-2">
                    {user.userType === "student" ? "Student" : 
                     user.userType === "room_owner" ? "Room Owner" : "Tiffin Provider"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        data-testid="input-name"
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1" data-testid="text-name">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm font-medium mt-1" data-testid="text-email">{user.email}</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        data-testid="input-phone"
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1" data-testid="text-phone">
                        {user.phoneNumber || "Not provided"}
                      </p>
                    )}
                  </div>

                  {user.userType === "student" && (
                    <div>
                      <Label htmlFor="college">College</Label>
                      {isEditing ? (
                        <Input
                          id="college"
                          value={profileData.college}
                          onChange={(e) => setProfileData(prev => ({ ...prev, college: e.target.value }))}
                          data-testid="input-college"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1" data-testid="text-college">
                          {user.college || "Not provided"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full" data-testid="profile-tabs">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="listings" data-testid="tab-listings">
                  {user.userType === "student" ? "Requirements" : "Listings"}
                </TabsTrigger>
                <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card data-testid="overview-stats">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {user.userType === "student" && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{userRequirements?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Requirements</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">0</div>
                            <div className="text-sm text-muted-foreground">Connections</div>
                          </div>
                        </>
                      )}
                      {user.userType === "room_owner" && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{userRooms?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Room Listings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">0</div>
                            <div className="text-sm text-muted-foreground">Inquiries</div>
                          </div>
                        </>
                      )}
                      {user.userType === "tiffin_provider" && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{userTiffin?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Tiffin Services</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">0</div>
                            <div className="text-sm text-muted-foreground">Subscribers</div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="listings" className="space-y-6">
                <Card data-testid="listings-content">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {user.userType === "student" ? "My Requirements" : "My Listings"}
                      </CardTitle>
                      <Button data-testid="button-add-listing">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {user.userType === "student" && (
                      <div className="space-y-4">
                        {userRequirements?.length === 0 ? (
                          <div className="text-center py-8" data-testid="no-requirements">
                            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No requirements posted</h3>
                            <p className="text-muted-foreground">
                              Post your first requirement to get started
                            </p>
                          </div>
                        ) : (
                          userRequirements?.map((requirement) => (
                            <Card key={requirement.id} data-testid={`requirement-${requirement.id}`}>
                              <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Looking for {requirement.type} in {requirement.location}
                                    </h4>
                                    <p className="text-muted-foreground text-sm mb-2">
                                      Budget: ₹{requirement.budgetMin} - ₹{requirement.budgetMax}
                                    </p>
                                    <p className="text-sm">{requirement.description}</p>
                                  </div>
                                  <Badge variant={requirement.isActive ? "default" : "secondary"}>
                                    {requirement.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <Card data-testid="messages-summary">
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No recent messages</h3>
                      <p className="text-muted-foreground mb-4">
                        Your conversations will appear here
                      </p>
                      <Button variant="outline" data-testid="button-view-all-messages">
                        View All Messages
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card data-testid="reviews-content">
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">
                        Reviews from your interactions will appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
