import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface FirebaseState {
  webTokenList: string[];
  androidTokenList: string[];
  iosTokenList: string[];
}

const initialState: FirebaseState = {
  webTokenList: [],
  androidTokenList: [],
  iosTokenList: []
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: (create) => ({
    setWebTokenList: create.reducer((state, action: PayloadAction<string[]>) => {
      state.webTokenList = action.payload;
    }),
    setAndroidTokenList: create.reducer((state, action: PayloadAction<string[]>) => {
      state.androidTokenList = action.payload;
    }),
    setIosTokenList: create.reducer((state, action: PayloadAction<string[]>) => {
      state.iosTokenList = action.payload;
    })
  })
  // selectors: {}
});

export const { setWebTokenList } = firebaseSlice.actions;
export const firebaseReducer = firebaseSlice.reducer;
export default firebaseReducer;
