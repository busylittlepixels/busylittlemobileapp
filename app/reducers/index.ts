// reducers/index.ts
import { combineReducers } from 'redux';
import favoriteReducer from './favoriteReducer';
import settingsReducer from './settingsReducer';
import messageReducer from './messageReducer';
import onboardingReducer from './onBoardingReducer';
import authSlice from '../services/auth/authSlice';

const rootReducer = combineReducers({
    favorite: favoriteReducer,
    settings: settingsReducer,
    message: messageReducer,
    onboarding: onboardingReducer,
    auth: authSlice,
});

export default rootReducer;
