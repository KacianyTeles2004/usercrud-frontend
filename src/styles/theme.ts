// src/styles/theme.ts
import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#A23F3F',
    primaryLight: '#f9f1f1',
    primaryDark: '#8a3636',
    error: '#ef4444',
    text: '#111827',
    textLight: '#6b7280',
    border: '#e5e7eb',
    background: '#f9fafb'
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem'
  }
};

export type ThemeType = typeof theme;