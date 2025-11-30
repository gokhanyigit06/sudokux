import {create} from 'zustand';
import {Settings} from '../types';
import {loadSettings, saveSettings} from '../utils/storage';

interface SettingsStore extends Settings {
  // Actions
  setLanguage: (language: 'tr' | 'en') => void;
  setDarkMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setAutoErrorCheck: (enabled: boolean) => void;
  setShowTimer: (enabled: boolean) => void;
  setBackgroundImage: (uri: string | undefined) => void;
  setPencilMode: (enabled: boolean) => void;
  togglePencilMode: () => void;
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  language: 'tr',
  darkMode: false,
  soundEnabled: true,
  hapticEnabled: true,
  autoErrorCheck: true,
  showTimer: true,
  backgroundImage: undefined,
  isPencilMode: false,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,

  setLanguage: (language) => {
    set({language});
    saveSettings(get());
  },

  setDarkMode: (enabled) => {
    set({darkMode: enabled});
    saveSettings(get());
  },

  setSoundEnabled: (enabled) => {
    set({soundEnabled: enabled});
    saveSettings(get());
  },

  setHapticEnabled: (enabled) => {
    set({hapticEnabled: enabled});
    saveSettings(get());
  },

  setAutoErrorCheck: (enabled) => {
    set({autoErrorCheck: enabled});
    saveSettings(get());
  },

  setShowTimer: (enabled) => {
    set({showTimer: enabled});
    saveSettings(get());
  },

  setBackgroundImage: (uri) => {
    set({backgroundImage: uri});
    saveSettings(get());
  },

  setPencilMode: (enabled) => {
    set({isPencilMode: enabled});
  },

  togglePencilMode: () => {
    set((state) => ({isPencilMode: !state.isPencilMode}));
  },

  loadSettings: async () => {
    const settings = await loadSettings();
    if (settings) {
      set(settings);
    }
  },

  resetSettings: () => {
    set(defaultSettings);
    saveSettings(defaultSettings);
  },
}));
