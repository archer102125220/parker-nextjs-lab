import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import systemReducer from './slices/systemSlice';

// 這裡可以導入你的 slice reducers
// import systemReducer from './slices/systemSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      system: systemReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// 使用這些 hooks 來替代普通的 useDispatch 和 useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
