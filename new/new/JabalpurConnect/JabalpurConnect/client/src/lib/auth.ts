import type { User } from "@shared/schema";

export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private tokens: AuthTokens | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadFromStorage(): void {
    try {
      const savedUser = localStorage.getItem("student-hub-user");
      const savedTokens = localStorage.getItem("student-hub-tokens");
      
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
      
      if (savedTokens) {
        this.tokens = JSON.parse(savedTokens);
        
        // Check if tokens are expired
        if (this.tokens && this.tokens.expiresAt < Date.now()) {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error("Error loading auth from storage:", error);
      this.clearAuth();
    }
  }

  private saveToStorage(): void {
    try {
      if (this.user) {
        localStorage.setItem("student-hub-user", JSON.stringify(this.user));
      }
      
      if (this.tokens) {
        localStorage.setItem("student-hub-tokens", JSON.stringify(this.tokens));
      }
    } catch (error) {
      console.error("Error saving auth to storage:", error);
    }
  }

  private clearAuth(): void {
    this.user = null;
    this.tokens = null;
    localStorage.removeItem("student-hub-user");
    localStorage.removeItem("student-hub-tokens");
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getAccessToken(): string | null {
    if (!this.tokens || this.tokens.expiresAt < Date.now()) {
      return null;
    }
    return this.tokens.accessToken;
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.getAccessToken() !== null;
  }

  async signInWithGoogle(additionalData?: {
    userType: "student" | "room_owner" | "tiffin_provider";
    college?: string;
    phoneNumber?: string;
  }): Promise<User> {
    try {
      // In a real implementation, this would use Google OAuth
      // For demo purposes, we'll simulate the flow
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!googleClientId) {
        throw new Error("Google OAuth not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.");
      }

      // Simulate Google OAuth response
      const mockGoogleUser: GoogleUser = {
        email: "demo@example.com",
        name: "Demo User",
        picture: "",
        sub: "google-user-id"
      };

      // Create user data for API
      const userData = {
        email: mockGoogleUser.email,
        name: mockGoogleUser.name,
        profileImage: mockGoogleUser.picture || "",
        userType: additionalData?.userType || "student",
        college: additionalData?.college,
        phoneNumber: additionalData?.phoneNumber
      };

      // Send to backend API
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const user: User = await response.json();
      
      // Create mock tokens
      this.tokens = {
        accessToken: `mock-token-${user.id}`,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      this.user = user;
      this.saveToStorage();

      return user;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  signOut(): void {
    this.clearAuth();
  }

  async refreshToken(): Promise<void> {
    // In a real implementation, this would refresh the access token
    // For now, we'll just extend the expiration
    if (this.tokens) {
      this.tokens.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      this.saveToStorage();
    }
  }

  updateUser(updates: Partial<User>): void {
    if (this.user) {
      this.user = { ...this.user, ...updates };
      this.saveToStorage();
    }
  }
}

export const authService = AuthService.getInstance();

export const getAuthHeaders = (): Record<string, string> => {
  const token = authService.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isTokenExpired = (): boolean => {
  const token = authService.getAccessToken();
  return !token;
};
