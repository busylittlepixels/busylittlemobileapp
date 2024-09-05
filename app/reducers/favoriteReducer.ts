// reducers/favoriteReducer.ts
import { 
  TOGGLE_FAVORITE, 
  SET_FAVORITES, 
  RESET_FAVORITES,
  UPDATE_FAVORITES
} 
from '../actions/favoriteActions';

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
    case RESET_FAVORITES:
      return {
        ...state,
        favorites: {},
      };
    case UPDATE_FAVORITES:
      return {
        ...state,
        favorites: action.payload, // Update the favorites with the new list
      };
    default:
      return state;
  }
};

export default favoriteReducer;
