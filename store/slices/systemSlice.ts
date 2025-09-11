import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface SystemState {
  systemName: string;
  // 可以添加其他常用的翻譯
}

const initialState: SystemState = {
  systemName: ''
};

// https://redux-toolkit.js.org/api/createslice#createasyncthunk
const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: (create) => ({
    setSystemName: create.reducer((state, action: PayloadAction<string>) => {
      state.systemName = action.payload;
    }),
  }),
  selectors: {
    systemNameUpperCase: (sliceState) => sliceState.systemName.toUpperCase()
  }
});

export const { setSystemName } = systemSlice.actions;
export default systemSlice.reducer;
