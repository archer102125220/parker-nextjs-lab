import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SystemState {
  systemName: string;
  // 可以添加其他常用的翻譯
}

const initialState: SystemState = {
  systemName: '',
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystemName: (state, action: PayloadAction<string>) => {
      state.systemName = action.payload;
    },
  },
});

export const { setSystemName } = systemSlice.actions;
export default systemSlice.reducer;
