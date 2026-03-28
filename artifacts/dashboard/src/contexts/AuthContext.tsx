import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginRequest, SignupRequest } from "@workspace/api-client-react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await getMe();
      if (userData && userData.id) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await apiLogin(data);
    if (res.user) {
      setUser(res.user);
    }
  };

  const signup = async (data: SignupRequest) => {
    const res = await apiSignup(data);
    if (res.user) {
      setUser(res.user);
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
