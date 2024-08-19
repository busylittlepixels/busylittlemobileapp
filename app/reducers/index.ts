// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer'; // Ensure paths are correct

const rootReducer = combineReducers({
  auth: authReducer,
  // other reducers can be added here
});

export default rootReducer;
