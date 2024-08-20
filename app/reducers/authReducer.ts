// reducers/authReducer.ts
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SET_LOADING,
  SET_FIRST_LAUNCH,
  COMPLETE_ONBOARDING,
} from '../actions/authActions';

const initialState = {
  user: null,
  loading: false,
  isFirstLaunch: false, // Default to true for first launch
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, loading: false };
    case LOGOUT_SUCCESS:
      return { ...state, user: null };
    case SIGNUP_SUCCESS:
      return { ...state, loading: false };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_FIRST_LAUNCH:
      console.log('first launch');
      return { ...state, isFirstLaunch: action.payload };
    case COMPLETE_ONBOARDING:
      console.log('onboarding reducer');
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default authReducer;
