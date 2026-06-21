import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../config/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  sendOTP: (name: string, email: string, phone: string) => Promise<void>;

  verifyOTP: (
    name: string,
    email: string,
    phone: string,
    password: string,
    otp: string,
  ) => Promise<void>;

  logout: () => void;

  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));

    toast.success("Login Successful");

    navigate("/");
  };

  const sendOTP = async (name: string, email: string, phone: string) => {
    await api.post("/auth/send-otp", {
      name,
      email,
      phone,
    });
  };

  const verifyOTP = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    otp: string,
  ) => {
    const { data } = await api.post("/auth/verify-otp", {
      name,
      email,
      phone,
      password,
      otp,
    });

    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));

    toast.success("Registration Successful");

    navigate("/");
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    navigate("/");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...userData,
    };

    setUser(updatedUser);

    localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        sendOTP,
        verifyOTP,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
