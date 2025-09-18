import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface SystemState {
  systemName: string;
  agreeNotification: boolean;
  firebaseCroeInited: boolean;
  firebaseMessagingInited: boolean;
}

const initialState: SystemState = {
  systemName: '',
  agreeNotification: false,
  firebaseCroeInited: false,
  firebaseMessagingInited: false
};

// https://redux-toolkit.js.org/api/createslice#createasyncthunk
const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: (create) => ({
    setSystemName: create.reducer((state, action: PayloadAction<string>) => {
      state.systemName = action.payload;
    }),
    setAgreeNotification: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.agreeNotification = action.payload;
      }
    ),
    setFirebaseCroeInited: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.firebaseCroeInited = action.payload;
      }
    ),
    setFirebaseMessagingInited: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.firebaseMessagingInited = action.payload;
      }
    )
  }),
  selectors: {
    systemNameUpperCase: (sliceState) => sliceState.systemName.toUpperCase()
  }
});

export const { setSystemName } = systemSlice.actions;
export const systemReducer = systemSlice.reducer;
export default systemReducer;
