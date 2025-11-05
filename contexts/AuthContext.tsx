import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userService } from "@/services/userService";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement du token au démarrage
  useEffect(() => {
    const loadToken = async () => {
      const stored = await AsyncStorage.getItem("token");
      if (stored) {
        // Vérifie s’il est valide avant de le garder
        const isValid = await userService.validateToken({token: stored});
        if (isValid) {
          setToken(stored);
        } else {
          await AsyncStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const signIn = async (newToken: string) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);