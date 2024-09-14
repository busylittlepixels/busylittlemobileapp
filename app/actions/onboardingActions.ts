// actions/authActions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch } from 'redux';
import { complete } from '../services/completeOnboardingService'; // Import the service

export const SET_FIRST_LAUNCH = 'SET_FIRST_LAUNCH';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';

export const checkFirstLaunch = () => async (dispatch: Dispatch) => {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (hasLaunched === null) {
      dispatch({ type: SET_FIRST_LAUNCH, payload: true });
      await AsyncStorage.setItem('hasLaunched', 'true');
    } else {
      dispatch({ type: SET_FIRST_LAUNCH, payload: false });
    }
};

export const completeOnboarding = (userId:any, cities: string[]) => async (dispatch: any) => {
    // console.log('authActions userID', userId);
    // console.log('authActions cities', cities);
  
    try {
      const onBoarded = await complete(userId, cities);
      // console.log('onboarded', onBoarded);
  
      if (onBoarded) {
        await AsyncStorage.setItem('user', JSON.stringify(onBoarded));
        // console.log('something worked');
        dispatch({ type: SET_FIRST_LAUNCH, payload: false });
        return onBoarded;  // Ensure the value is returned here
      } else {
        console.error('Failed to complete onboarding - auth actions');
        return null;  // Explicitly return null if onboarding fails
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      return null;  // Explicitly return null on error
    }
  };