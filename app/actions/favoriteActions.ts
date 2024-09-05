// actions/favoriteActions.ts
import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetFavorites, getFavorites, toggleFavorite as toggleFavoriteService } from '../services/favouriteService';

export const SET_FAVORITES = 'SET_FAVORITES';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const RESET_FAVORITES = 'RESET_FAVORITES';
export const UPDATE_FAVORITES = 'UPDATE_FAVORITES'

// Action to set favorites in Redux state
export const setFavorites = (favorites: any) => ({
    type: SET_FAVORITES,
    payload: favorites,
});

// Action to fetch favorites from the backend and store them in Redux
export const fetchFavorites = (userId: any) => async (dispatch: Dispatch) => {
    try {
        const result = await getFavorites(userId);

        if (result.error) {
            console.error('Error fetching favorites:', result.error);
            return;
        }

        const favorites = result.data?.reduce((acc: any, item: any) => {
            acc[item.article_id] = item;
            return acc;
        }, {});

        dispatch(setFavorites(favorites));

    } catch (error) {
        console.error('Unexpected error while fetching favorites:', error);
    }
};

// Action to toggle favorite status of an article
export const toggleFavorite = (userId: any, article: any) => async (dispatch: Dispatch, getState: any) => {
    const { article_id } = article; // Assume you're using article_id as the identifier
    const { favorites } = getState().favorite;

    try {
        // Toggle the favorite in the backend
        const result = await toggleFavoriteService(userId, article_id, article.title, article.slug, article.content);

        if (result.error) {
            console.error('Error toggling favorite:', result.error);
            return;
        }

        // Update the Redux state
        const updatedFavorites = { ...favorites };
        if (favorites[article_id]) {
            // Remove from favorites
            delete updatedFavorites[article_id];
        } else {
            // Add to favorites - store the full article data
            updatedFavorites[article_id] = article;
        }

        dispatch({
            type: TOGGLE_FAVORITE,
            payload: updatedFavorites,
        });

        // Update AsyncStorage
        await AsyncStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));

    } catch (error) {
        console.error('Unexpected error while toggling favorite:', error);
    }
};

export const clearFavorites = (userId: any) => async (dispatch: Dispatch) => {
    try {
        const result = await resetFavorites(userId); // Call the resetFavorites service
        if (result.error) {
            console.error('Failed to clear favorites:', result.error);
        } else {
            dispatch({ type: RESET_FAVORITES });
            await AsyncStorage.removeItem(`favorites_${userId}`);
        }
    } catch (error) {
        console.error('Unexpected error in clearing favorites:', error);
    }
};
