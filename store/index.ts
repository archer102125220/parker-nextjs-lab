import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import systemReducer from '@/store/slices/systemSlice';
import type { SystemState } from '@/store/slices/systemSlice';

export interface PreloadedState {
  system: SystemState;
}

export const makeStore = (preloadedState?: PreloadedState) =>
  configureStore<PreloadedState>({
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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// 使用這些 hooks 來替代普通的 useDispatch 和 useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
