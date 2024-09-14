// reducers/index.ts
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import favoriteReducer from './favoriteReducer';
import settingsReducer from './settingsReducer';
import messageReducer from './messageReducer';
import onboardingReducer from './onBoardingReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    favorite: favoriteReducer,
    settings: settingsReducer,
    message: messageReducer,
    onboarding: onboardingReducer
});

export default rootReducer;
