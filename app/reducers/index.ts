// reducers/index.ts
import { combineReducers } from 'redux';
import favoriteReducer from './favoriteReducer';
import settingsReducer from './settingsReducer';
import messageReducer from './messageReducer';
import onboardingReducer from './onBoardingReducer';

const rootReducer = combineReducers({
    favorite: favoriteReducer,
    settings: settingsReducer,
    message: messageReducer,
    onboarding: onboardingReducer
});

export default rootReducer;
