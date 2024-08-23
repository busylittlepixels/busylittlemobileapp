// reducers/favoriteReducer.ts
import { TOGGLE_FAVORITE, SET_FAVORITES } from '../actions/favoriteActions';

const initialState = {
    favorites: {},
};

const favoriteReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_FAVORITES:
            return {
                ...state,
                favorites: action.payload,
            };
        case TOGGLE_FAVORITE:
            return {
                ...state,
                favorites: action.payload,
            };
        default:
            return state;
    }
};

export default favoriteReducer;
