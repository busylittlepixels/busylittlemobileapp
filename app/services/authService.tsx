import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
}

export const authService = {
  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const user: User = {
        id: data.user.id,
        // @ts-ignore
        email: data.user.email
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  async signUp(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const user: User = {
        id: data.user.id,
        // @ts-ignore
        email: data.user.email
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('user');
  },
  
  async getUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
