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
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#2b2b2b'
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
            border: '3px solid #2b2b2b'
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor: '#959595'
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor: '#959595'
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: '#959595'
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#2b2b2b'
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
