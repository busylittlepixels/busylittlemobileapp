import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false); // Ensure loading is set to false after checking the stored user
    };
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const loggedInUser = await authService.signIn(email, password);
    if (loggedInUser) {
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    }
  };

  const signUp = async (email: string, password: string) => {
    const newUser = await authService.signUp(email, password);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
