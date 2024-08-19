// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Ensure this is the correct path to your root reducer

const store = configureStore({
  reducer: rootReducer,
  // Add any additional middleware here
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourMiddleware),
});

export default store;
