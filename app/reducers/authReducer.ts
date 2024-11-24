// reducers/authReducer.ts
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SIGNUP_SUCCESS,
  SET_LOADING,
  SET_USER
} from '../actions/authActions';

const initialState = {
  user: null,
  loading: false,
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
    case SET_USER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default authReducer;
