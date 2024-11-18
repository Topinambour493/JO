import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favorites"; // Importer le slice

// Configuration du store Redux
const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
