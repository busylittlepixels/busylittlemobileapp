// reducers/index.ts
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import favoriteReducer from './favoriteReducer';
import settingsReducer from './settingsReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    favorite: favoriteReducer,
    settings: settingsReducer,
    message: messageReducer
});

export default rootReducer;
