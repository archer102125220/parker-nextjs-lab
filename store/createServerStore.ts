import { configureStore } from '@reduxjs/toolkit';
import systemReducer from '@/store/slices/systemSlice';

export function createServerStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      system: systemReducer
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production'
  });
}
