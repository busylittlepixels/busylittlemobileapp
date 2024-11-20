// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './reducers'; // Ensure this is the correct path to your rootReducer
import { authApi } from './services/auth/authApi';

// Ensure rootReducer is an object with key-value pairs of slices
const store = configureStore({
  reducer: {
    root: rootReducer, // Include all reducers from the rootReducer
    [authApi.reducerPath]: authApi.reducer, // Add the authApi reducer under its path
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // Add authApi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
