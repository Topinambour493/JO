import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {favoriteType} from "../../types/types";
import store from "../store";

// État initial
const initialState: string[] = [];

// Slice Redux
const favoritesSlice = createSlice({
  initialState,
  name: "favorites",
  reducers:
    {
      toggleFavorite: (state, action: PayloadAction<string>) => {
        if (!state.includes(action.payload)) {
          state.push(action.payload);
        } else {
          return state.filter(id => id !== action.payload)
        }
      },
    },
});

// Actions
export const {toggleFavorite} = favoritesSlice.actions;

// Réducteur
export default favoritesSlice.reducer;
