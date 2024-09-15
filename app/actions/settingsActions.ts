// actions/settingsActions.ts
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enablePublicProfile as enableProfileService } from '../services/settingsService';

export const SET_PUBLIC_PROFILE = 'SET_PUBLIC_PROFILE';
export const SET_ADVERT_PREFERENCE = 'SET_ADVERT_PREFERENCE';
export const SET_NOTIFICATION_PREFERENCE = 'SET_NOTIFICATION_PREFERENCE';

// Action to set advert preference
export const setAdvertPreference = (showAdverts: any) => async (dispatch: Dispatch) => {
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

export const setNotificationsPreference = (showNotifications: any) => async (dispatch: Dispatch) => {
  try {
    // Save the preference in AsyncStorage
    await AsyncStorage.setItem('showNotifications', JSON.stringify(showNotifications));

    // Dispatch the action to update Redux state
    dispatch({
      type: SET_NOTIFICATION_PREFERENCE,
      payload: showNotifications,
    });
  } catch (error) {
    console.error('Failed to save notifications preference', error);
  }
};

// Action to set public profile preference
export const setPublicProfile = (isPublic: boolean, userId: string) => async (dispatch: Dispatch) => {
  // console.log('Setting public profile:', isPublic);
  // console.log('and the fucking user id', userId)
  try {
    // Call the service to enable/disable public profile
    const result = await enableProfileService({ userId });

    if (result?.error) {
      console.error('Error enabling public profile:', result.error);
      return;
    }

    // Save the preference in AsyncStorage
    await AsyncStorage.setItem('enablePublicProfile', JSON.stringify(isPublic));

    // Dispatch the action to update Redux state
    dispatch({
      type: SET_PUBLIC_PROFILE,
      payload: isPublic,
    });
  } catch (error) {
    console.error('Failed to set public profile', error);
  }
};
