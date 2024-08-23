// reducers/index.ts
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import favoriteReducer from './favoriteReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    favorite: favoriteReducer,
});

export default rootReducer;
