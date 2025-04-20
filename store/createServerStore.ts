import { configureStore } from '@reduxjs/toolkit';
import systemReducer from '@/store/slices/systemSlice';
import type { SystemState } from '@/store/slices/systemSlice';

export interface RootState {
  system: SystemState;
}

export function createServerStore(preloadedState?: RootState) {
  return configureStore<RootState>({
    reducer: {
      system: systemReducer
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      })
  });
}
