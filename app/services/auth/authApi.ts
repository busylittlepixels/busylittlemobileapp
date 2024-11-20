import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../../supabase'; // Adjust the import path as needed
import { RootState } from '../../store';
import { setCredentials } from '../../services/auth/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '', // Not used for Supabase as requests are handled locally
  }),
  endpoints: (builder) => ({
    // Supabase Sign In
    signIn: builder.mutation<{ user: any; session: any }, { email: string; password: string }>({
      queryFn: async ({ email, password }, { dispatch }) => {
        try {
          // Perform sign-in with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
          if (error) {
            return { error: { status: 400, data: error.message } };
          }
    
          if (data?.user && data?.session) {
            // Save user and session to Async Storage
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('access_token', data.session.access_token);
            await AsyncStorage.setItem('refresh_token', data.session.refresh_token);
    
            // Dispatch action to update Redux state
            dispatch(setCredentials({ user: data.user, token: data.session.access_token }));
    
            return { data };
          }
    
          return { error: { status: 500, data: 'Unexpected error: No user or session found' } };
        } catch (err: any) {
          return { error: { status: 500, data: err.message || 'An error occurred' } };
        }
      },
    }),

    // Supabase Sign Up
    signUp: builder.mutation<void, { email: string; password: string; full_name: string; username: string }>({
      // @ts-ignore
      queryFn: async ({ email, password, full_name, username }) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name, username } },
        });
        if (error) return { error: { status: 400, data: error.message } };
        return { data: null };
      },
    }),

    // Supabase Sign Out
    signOut: builder.mutation<void, void>({
      // @ts-ignore
      queryFn: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return { error: { status: 400, data: error.message } };
        return { data: null };
      },
    }),

    // Complete Onboarding
    completeOnboarding: builder.mutation<any, { userId: string; selectedCities: string[] }>({
      // @ts-ignore
      queryFn: async ({ userId, selectedCities }) => {
        const { data, error } = await supabase
          .from('profiles')
          .update({ cities: selectedCities })
          .eq('id', userId);

        if (error) return { error: { status: 400, data: error.message } };
        return { data };
      },
    }),

    // Reset Password
    resetPassword: builder.mutation<void, { email: string }>({
      // @ts-ignore
      queryFn: async ({ email }) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://busylittleplatform.vercel.app/reset-password',
        });

        if (error) return { error: { status: 400, data: error.message } };
        return { data: null };
      },
    }),
  }),
});

// Add local selectors or utility hooks

// @ts-ignore
export const selectCurrentUser = (state: RootState) => state.root?.auth?.user || null;
// @ts-ignore
export const selectAuthLoading = (state: RootState) => state.root?.auth.isLoading || false;
// @ts-ignore
export const selectAuthError = (state: RootState) => state.root?.auth.error || null;
// @ts-ignore
export const selectIsFirstLaunch = (state: RootState) => state.root?.auth.isFirstLaunch || false;



// Export hooks for each API
export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useCompleteOnboardingMutation,
  useResetPasswordMutation,
} = authApi;
