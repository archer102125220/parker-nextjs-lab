'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  // typography: {
  //   fontFamily: 'var(--font-roboto)'
  // }
});

export default theme;
export type ThemeType = typeof theme;
export type ThemeTypeKey = keyof ThemeType;
