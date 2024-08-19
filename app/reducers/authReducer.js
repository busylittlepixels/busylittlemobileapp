// reducers/authReducer.js
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    SET_LOADING,
    SET_FIRST_LAUNCH,
  } from '../actions/authActions';
  
  const initialState = {
    user: null,
    loading: false,
    isFirstLaunch: null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          user: action.payload,
          loading: false,
          error: null,
        };
      case LOGOUT_SUCCESS:
        return {
          ...state,
          user: null,
          loading: false,
          error: null,
        };
      case SET_LOADING:
        return {
          ...state,
          loading: action.payload,
        };
      case SET_FIRST_LAUNCH:
        return {
          ...state,
          isFirstLaunch: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
  