// actions/authActions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import { authService } from '../services/authService';
import { complete } from '../services/completeOnboardingService'; // Import the service

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SET_LOADING = 'SET_LOADING';
export const SET_FIRST_LAUNCH = 'SET_FIRST_LAUNCH';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';

// Action Creators
export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    const { user, session } = await authService.signIn(email, password);
    if (user && session) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: LOGIN_SUCCESS, payload: user });
    }
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const signUp = (
  email: string,
  password: string,
  full_name: string,
  username: string
) => async (dispatch: Dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    await authService.signUp(email, password, full_name, username);
    dispatch({ type: SIGNUP_SUCCESS });
  } catch (error) {
    console.error('Error signing up:', error);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    await authService.signOut();
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const checkFirstLaunch = () => async (dispatch: Dispatch) => {
  const hasLaunched = await AsyncStorage.getItem('hasLaunched');
  if (hasLaunched === null) {
    dispatch({ type: SET_FIRST_LAUNCH, payload: true });
    await AsyncStorage.setItem('hasLaunched', 'true');
  } else {
    dispatch({ type: SET_FIRST_LAUNCH, payload: false });
  }
};

export const completeOnboarding = (userId: string, cities: string[]) => async (dispatch: Dispatch) => {
  try {
      const updatedUser = await complete({ id: userId }, cities);
      if (updatedUser) {
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          dispatch({ type: COMPLETE_ONBOARDING, payload: updatedUser });
          return updatedUser;
      } else {
          throw new Error('Onboarding failed.');
      }
  } catch (error) {
      console.error('Error in completeOnboarding action:', error);
      return null;
  }
};