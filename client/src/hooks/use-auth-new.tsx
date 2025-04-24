import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [, navigate] = useLocation();

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }
      
      if (data.success && data.user) {
        setUser(data.user);
        toast({
          title: "Success",
          description: "You have been logged in successfully",
        });
        navigate("/");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Registration failed with status ${response.status}`);
      }
      
      if (data.success && data.user) {
        setUser(data.user);
        toast({
          title: "Success",
          description: "Your account has been created successfully",
        });
        navigate("/");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Logout failed with status ${response.status}`);
      }
      
      if (data.success) {
        setUser(null);
        toast({
          title: "Success",
          description: "You have been logged out successfully",
        });
        navigate("/auth");
      } else {
        throw new Error(data.message || "Logout failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive",
      });
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}