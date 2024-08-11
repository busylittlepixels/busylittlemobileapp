import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { complete } from '../services/completeOnboardingService';

interface User {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  cities?: [], // or null if you prefer
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, full_name: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  isFirstLaunch: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  completeOnboarding: async () => {},
  isFirstLaunch: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    };

    loadUser();
    checkFirstLaunch();
  }, []);

  const signIn = async (email: string, password: string) => {
    const loggedInUser = await authService.signIn(email, password);
    if (loggedInUser) {
      await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    }
  };

  const signUp = async (email: string, password: string, full_name: string, username: string) => {
    const newUser = await authService.signUp(email, password, full_name, username);
    // @ts-ignore
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


  const completeOnboarding = async (userId: any, selectedCities:any) => {

    try {
      const onBoarded = await complete(userId, selectedCities);
      console.log('onboarded', onBoarded);
      if (onBoarded) {
          // Store the updated user profile in AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(onBoarded));
          // Update the user in the AuthContext
        //  console.log('something worked')
          setIsFirstLaunch(false);
      } else {
          console.error('Failed to complete onboarding');
      }
    } catch (error) {
        console.error('Error during onboarding:', error);
    }

    
  };

  return (
    // @ts-ignore
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, completeOnboarding, isFirstLaunch }}>
      {children}
    </AuthContext.Provider>
  );
};


