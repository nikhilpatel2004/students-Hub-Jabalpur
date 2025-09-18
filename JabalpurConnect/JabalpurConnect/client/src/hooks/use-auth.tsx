import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, InsertUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: (userData: Omit<InsertUser, "id">) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("student-hub-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("student-hub-user");
      }
    }
    setIsLoading(false);
  }, []);

  const signInMutation = useMutation({
    mutationFn: async (userData: Omit<InsertUser, "id">) => {
      const response = await apiRequest("POST", "/api/auth/google", userData);
      return response.json();
    },
    onSuccess: (userData: User) => {
      setUser(userData);
      localStorage.setItem("student-hub-user", JSON.stringify(userData));
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Welcome to Student Hub Jabalpur!" });
      
      // Redirect to appropriate page
      const currentPath = window.location.pathname;
      if (currentPath === "/auth") {
        window.location.href = "/";
      }
    },
    onError: (error) => {
      toast({ 
        title: "Authentication failed", 
        description: "Please try again later",
        variant: "destructive" 
      });
    }
  });

  const signInWithGoogle = async (userData: Omit<InsertUser, "id">) => {
    await signInMutation.mutateAsync(userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("student-hub-user");
    queryClient.clear();
    toast({ title: "Signed out successfully" });
    window.location.href = "/";
  };

  const value = {
    user,
    isLoading: isLoading || signInMutation.isPending,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
