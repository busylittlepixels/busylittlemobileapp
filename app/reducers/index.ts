// reducers/index.ts
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import favoriteReducer from './favoriteReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    favorite: favoriteReducer,
    settings: settingsReducer
});

export default rootReducer;
