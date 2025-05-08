// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Ensure this is the correct path to your root reducer

const store = configureStore({
  reducer: rootReducer,
  // Add any additional middleware here
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourMiddleware),
});

// Define types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Make sure to export the store as default
export default store;
