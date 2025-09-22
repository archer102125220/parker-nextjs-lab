import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface windowInfo {
  width?: number;
  height?: number;
  isMobile: boolean;
  isTabletOnly: boolean;
  isTablet: boolean;
}
export interface SystemState extends windowInfo {
  systemName: string;
  windowInnerWidth: number;
  windowInnerHeight: number;
  loading: boolean;
  agreeNotification: boolean;
  firebaseCroeInited: boolean;
  firebaseMessagingInited: boolean;
}

const initialState: SystemState = {
  systemName: '',
  windowInnerWidth: 1920,
  windowInnerHeight: 1080,
  isMobile: false,
  isTabletOnly: false,
  isTablet: false,
  loading: false,
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
    setWindowInnerSize: create.reducer(
      (state, action: PayloadAction<windowInfo>) => {
        const {
          width,
          height,
          isMobile = false,
          isTabletOnly = false,
          isTablet = false
        } = action.payload;

        state.windowInnerWidth = isNaN(width || 0) ? 1920 : Number(width);
        state.windowInnerHeight = isNaN(height || 0) ? 1920 : Number(height);
        state.isMobile = typeof isMobile !== 'boolean' ? false : isMobile;
        state.isTabletOnly =
          typeof isTabletOnly !== 'boolean' ? false : isTabletOnly;
        state.isTablet = typeof isTablet !== 'boolean' ? false : isTablet;
      }
    ),
    setLoading: create.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
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
