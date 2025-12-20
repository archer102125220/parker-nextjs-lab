'use client';
// https://zh-hans.react.dev/reference/rsc/use-client
import type { Theme } from '@mui/material/styles';
import type { Localization } from '@mui/material/locale';
import { createTheme as muiCreateTheme } from '@mui/material/styles';

export type createThemeType = (newTheme: Localization) => Theme;
export const themeSetting = {
  cssVariables: true,
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  },
  typography: {
    fontFamily: 'var(--font-roboto)'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Match global.scss scrollbar styles
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '10px'
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: '#e8effd',
            border: '1px solid #e8effd'
          },
          '&::-webkit-scrollbar-track-piece, & *::-webkit-scrollbar-track-piece':
            {
              backgroundColor: '#ffffff00'
            },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            boxShadow: 'transparent'
          }
        }
      }
    }
  }
};
export const theme: Theme = muiCreateTheme({
  ...themeSetting
});
export const createTheme: createThemeType = (newTheme: Localization) =>
  muiCreateTheme(themeSetting, newTheme);

export default theme;

export type ThemeSettingType = typeof themeSetting;
export type ThemeSettingTypeKey = keyof ThemeSettingType;
export type ThemeType = typeof theme;
export type ThemeTypeKey = keyof ThemeType;
