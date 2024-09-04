// actions/settingsActions.ts
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enablePublicProfile } from '../services/settingsService';

export const SET_PUBLIC_PROFILE = 'SET_PUBLIC_PROFILE';
export const SET_ADVERT_PREFERENCE = 'SET_ADVERT_PREFERENCE';

// Action to set advert preference

// Action to set advert preference
export const setAdvertPreference = (showAdverts: any) => async (dispatch: any) => {
    try {
      // Save the preference in AsyncStorage
      await AsyncStorage.setItem('showAdverts', JSON.stringify(showAdverts));
  
      // Dispatch the action to update Redux state
      dispatch({
        type: SET_ADVERT_PREFERENCE,
        payload: showAdverts,
      });
    } catch (error) {
      console.error('Failed to save advert preference', error);
    }
  };

// Action to set public profile preference
export const setPublicProfile = (enablePublicProfile: any) => async (dispatch: any) => {

    console.log('profile public', enablePublicProfile);

    try {
      // Save the preference in AsyncStorage
      await AsyncStorage.setItem('enablePublicProfile', JSON.stringify(enablePublicProfile));
  
      // Dispatch the action to update Redux state
      dispatch({
        type: SET_PUBLIC_PROFILE,
        payload: enablePublicProfile,
      });
    } catch (error) {
      console.error('Failed to save advert preference', error);
    }
  };