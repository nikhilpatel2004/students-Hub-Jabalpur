import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Mail, User, Building } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"student" | "room_owner" | "tiffin_provider">("student");
  const [additionalInfo, setAdditionalInfo] = useState({
    college: "",
    phoneNumber: ""
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would integrate with Google OAuth
      // For now, we'll simulate the process
      const mockUserData = {
        email: "user@example.com",
        name: "Demo User",
        profileImage: "",
        userType,
        college: userType === "student" ? additionalInfo.college : undefined,
        phoneNumber: additionalInfo.phoneNumber
      };

      await signInWithGoogle(mockUserData);
      toast({ title: "Successfully signed in!" });
    } catch (error) {
      toast({ 
        title: "Sign in failed", 
        description: "Please try again later",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Student Hub Jabalpur
          </h2>
          <p className="text-muted-foreground">
            Sign in to connect with the best rooms and tiffin services
          </p>
        </div>

        <Card data-testid="auth-form">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label>I am a:</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("student")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    userType === "student" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="select-student"
                >
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-sm text-muted-foreground">
                        Looking for rooms and tiffin services
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("room_owner")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    userType === "room_owner" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="select-room-owner"
                >
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Room Owner</div>
                      <div className="text-sm text-muted-foreground">
                        List PGs, hostels, and rental rooms
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("tiffin_provider")}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    userType === "tiffin_provider" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="select-tiffin-provider"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Tiffin Provider</div>
                      <div className="text-sm text-muted-foreground">
                        Offer home-cooked meal services
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              {userType === "student" && (
                <div>
                  <Label htmlFor="college">College/University</Label>
                  <Select 
                    value={additionalInfo.college} 
                    onValueChange={(value) => setAdditionalInfo(prev => ({ ...prev, college: value }))}
                  >
                    <SelectTrigger data-testid="select-college">
                      <SelectValue placeholder="Select your college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iiitdm-jabalpur">IIITDM Jabalpur</SelectItem>
                      <SelectItem value="nit-bhopal">NIT Bhopal</SelectItem>
                      <SelectItem value="medicaps">Medicaps University</SelectItem>
                      <SelectItem value="lnct">LNCT University</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={additionalInfo.phoneNumber}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  data-testid="input-phone"
                />
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading || (userType === "student" && !additionalInfo.college)}
              className="w-full"
              data-testid="button-google-signin"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Continue with Google
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
