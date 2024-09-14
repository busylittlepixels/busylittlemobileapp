// reducers/onboardingReducer.ts
import {
    SET_FIRST_LAUNCH,
    COMPLETE_ONBOARDING,
  } from '../actions/onboardingActions';
  
  const initialState = {
    user: null,
    isFirstLaunch: false, // Default to true for first launch
  };
  
  const onboardingReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case SET_FIRST_LAUNCH:
        return { ...state, isFirstLaunch: action.payload };
      case COMPLETE_ONBOARDING:
        return { ...state, user: action.payload };
      default:
        return state;
    }
  };
  
  export default onboardingReducer;
  