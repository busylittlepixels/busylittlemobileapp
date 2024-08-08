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
    if (data && data.user) {
      const user: User = {
        id: data.user.id,
        // @ts-ignore
        email: data.user.email,
      };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      if (data.session) {
        // Store tokens
        await AsyncStorage.setItem('access_token', data.session.access_token);
        await AsyncStorage.setItem('refresh_token', data.session.refresh_token);
      }
      return user;
    }
    return null;
  },

  async signUp(email: string, password: string, full_name: string, username: string): Promise<void> {
   
    const { data, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            full_name: full_name,
            username: username,
          },
        },
      }
    );

    console.log('data', data);
    if (error) throw error;

    // Do not store user details or session tokens here
    // Instead, instruct the user to check their email for confirmation
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  },

  async getUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },



  async resetPassword(email: string): Promise<User | null> {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://busylittleplatform.vercel.app/reset-password/new-password',
    })
    
    return null;
  },

};
