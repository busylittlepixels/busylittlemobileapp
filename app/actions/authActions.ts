// actions/authActions.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SET_LOADING = 'SET_LOADING';
export const SET_FIRST_LAUNCH = 'SET_FIRST_LAUNCH';

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    const { user, session } = await authService.signIn(email, password);
    if (user && session) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('access_token', session.access_token);
      await AsyncStorage.setItem('refresh_token', session.refresh_token);
      dispatch({ type: LOGIN_SUCCESS, payload: user });
    }
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const signUp = (email, password, full_name, username) => async (dispatch) => {
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

export const logout = () => async (dispatch) => {
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

export const checkFirstLaunch = () => async (dispatch) => {
  const hasLaunched = await AsyncStorage.getItem('hasLaunched');
  if (hasLaunched === null) {
    dispatch({ type: SET_FIRST_LAUNCH, payload: true });
    await AsyncStorage.setItem('hasLaunched', 'true');
  } else {
    dispatch({ type: SET_FIRST_LAUNCH, payload: false });
  }
};
