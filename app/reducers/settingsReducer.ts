// reducers/settingsReducer.ts
import {
    SET_PUBLIC_PROFILE,
    SET_ADVERT_PREFERENCE
  } from '../actions/settingsActions';
  
  const initialState = {
    enablePublicProfile: null,  // Default to true or false based on your preference
    showAdverts: null,  // Default to true or false based on your preference
  };
  
  
  const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case SET_ADVERT_PREFERENCE:
        return { ...state, showAdverts: action.payload };
      case SET_PUBLIC_PROFILE:
        return { ...state, enablePublicProfile: action.payload };
      default:
        return state;
    }
  };
  
  export default settingsReducer;
  