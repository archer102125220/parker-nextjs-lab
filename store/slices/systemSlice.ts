import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { OverridableStringUnion } from '@mui/types';
import type { AlertColor, AlertPropsColorOverrides } from '@mui/material/Alert';

export interface windowInfo {
  width?: number;
  height?: number;
  isMobile: boolean;
  isTabletOnly: boolean;
  isTablet: boolean;
}
export type messageTypText = string;
export type messageTypeType = OverridableStringUnion<
  AlertColor,
  AlertPropsColorOverrides
>;
export type messageType = {
  text: messageTypText;
  type: messageTypeType;
};
export interface SystemState extends windowInfo {
  systemName: string;
  message: messageType;
  windowInnerWidth: number;
  windowInnerHeight: number;
  loading: boolean;
  agreeNotification: boolean;
  firebaseCroeInited: boolean;
  firebaseMessagingInited: boolean;
}

export const MESSAGE_TYPE = ['success', 'info', 'warning', 'error'];

const initialState: SystemState = {
  systemName: '',
  message: { text: '', type: 'success' },
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
    ),
    message_reset: create.reducer((state) => {
      state.message = { text: '', type: 'success' };
    }),
    message_success: create.reducer(
      (state, { payload }: PayloadAction<string>) => {
        state.message = { text: payload, type: 'success' };
      }
    ),
    message_error: create.reducer(
      (state, { payload }: PayloadAction<string>) => {
        state.message = { text: payload, type: 'error' };
      }
    ),
    message_information: create.reducer(
      (state, { payload }: PayloadAction<string>) => {
        state.message = { text: payload, type: 'info' };
      }
    ),
    message_warning: create.reducer(
      (state, { payload }: PayloadAction<string>) => {
        state.message = { text: payload, type: 'warning' };
      }
    ),

    SAVE_message: create.reducer(
      (state, { payload }: PayloadAction<messageType>) => {
        state.message = payload;
      }
    )
  }),
  selectors: {
    messageContext: (sliceState) => {
      const messageContext = sliceState.message?.text;
      return typeof messageContext === 'string' ? messageContext : '';
    },
    messageType: (sliceState) => {
      const messageType = sliceState.message?.type;
      MESSAGE_TYPE.includes(messageType);
      return MESSAGE_TYPE.includes(messageType) ? messageType : MESSAGE_TYPE[0];
    }
  }
});

export const { setSystemName } = systemSlice.actions;
export const systemReducer = systemSlice.reducer;
export const systemSelectors = systemSlice.selectors;
export default systemReducer;
