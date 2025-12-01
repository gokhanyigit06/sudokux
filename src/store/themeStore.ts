import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  isDark: boolean;
  colors: {
    // Background colors
    background: string;
    surface: string;
    card: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textDisabled: string;
    
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Status colors
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // UI elements
    border: string;
    divider: string;
    highlight: string;
    selected: string;
    
    // Sudoku specific
    fixedCell: string;
    userCell: string;
    cellBackground: string;
    cellBorder: string;
    cellSelected: string;
    cellHighlight: string;
    cellValid: string;
    cellInvalid: string;
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#1a1a2e',
    surface: '#2a2a3e',
    card: '#fff',
    
    text: '#fff',
    textSecondary: '#999',
    textDisabled: '#666',
    
    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#388E3C',
    
    success: '#4CAF50',
    error: '#f44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    border: '#333',
    divider: '#444',
    highlight: '#E3F2FD',
    selected: '#BBDEFB',
    
    fixedCell: '#000',
    userCell: '#2196F3',
    cellBackground: '#fff',
    cellBorder: '#999',
    cellSelected: '#BBDEFB',
    cellHighlight: '#E3F2FD',
    cellValid: '#C8E6C9',
    cellInvalid: '#FFCDD2',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#000000',
    surface: '#1a1a1a',
    card: '#2a2a2a',
    
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    textDisabled: '#666666',
    
    primary: '#66BB6A',
    primaryLight: '#81C784',
    primaryDark: '#4CAF50',
    
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
    info: '#42A5F5',
    
    border: '#444',
    divider: '#333',
    highlight: '#1E3A5F',
    selected: '#1565C0',
    
    fixedCell: '#E0E0E0',
    userCell: '#64B5F6',
    cellBackground: '#2a2a2a',
    cellBorder: '#555',
    cellSelected: '#1565C0',
    cellHighlight: '#1E3A5F',
    cellValid: '#2E7D32',
    cellInvalid: '#C62828',
  },
};

interface ThemeStore {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      theme: lightTheme,
      
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
          theme: state.mode === 'light' ? darkTheme : lightTheme,
        })),
      
      setTheme: (mode: ThemeMode) =>
        set({
          mode,
          theme: mode === 'light' ? lightTheme : darkTheme,
        }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
