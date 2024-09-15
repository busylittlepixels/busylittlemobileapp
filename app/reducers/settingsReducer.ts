// reducers/settingsReducer.ts
import {
    SET_PUBLIC_PROFILE,
    SET_ADVERT_PREFERENCE, 
    SET_NOTIFICATION_PREFERENCE
  } from '../actions/settingsActions';
  
  const initialState = {
    enablePublicProfile: true,  // Default to true or false based on user preference
    showAdverts: false,  // Default to true or false based on user preference
    showNotifications: false, 
  };
  
  
  const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case SET_ADVERT_PREFERENCE:
        return { ...state, showAdverts: action.payload };
      case SET_PUBLIC_PROFILE:
        return { ...state, enablePublicProfile: action.payload };
      case SET_NOTIFICATION_PREFERENCE:
        return { ...state, showNotifications: action.payload };
      default:
        return state;
    }
  };
  
  export default settingsReducer;
  