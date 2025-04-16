'use client';
// https://zh-hans.react.dev/reference/rsc/use-client
import { createTheme as muiCreateTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { Localization } from '@mui/material/locale';

export type createThemeType = (newTheme: Localization) => Theme;
export const themeSetting = {
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)'
  }
};
export const theme: Theme = muiCreateTheme(themeSetting);
export const createTheme: createThemeType = (newTheme: Localization) =>
  muiCreateTheme(themeSetting, newTheme);

export default theme;

export type ThemeSettingType = typeof themeSetting;
export type ThemeSettingTypeKey = keyof ThemeSettingType;
export type ThemeType = typeof theme;
export type ThemeTypeKey = keyof ThemeType;
