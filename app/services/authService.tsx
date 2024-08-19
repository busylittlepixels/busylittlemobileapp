// authService.ts
import { supabase } from '../../supabase';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data && data.user) {
      return { user: data.user, session: data.session };
    }
    return { user: null, session: null };
  },

  async signUp(email: string, password: string, full_name: string, username: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          username,
        },
      },
    });
    if (error) throw error;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async completeOnboarding(userId: string, selectedCities: string[]) {
    // Perform your onboarding logic, e.g., updating the user's profile with selected cities
    const { data, error } = await supabase
      .from('profiles')
      .update({ cities: selectedCities })
      .eq('id', userId);

    if (error) throw error;
    return data; // Return updated user profile or other relevant data
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://yourapp.com/reset-password',
    });
    if (error) throw error;
  },
};
