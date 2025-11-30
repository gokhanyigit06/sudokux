import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameState, Settings, Statistics} from '../types';

// Storage keys
const KEYS = {
  GAME_STATE: '@sudoku_game_state',
  SETTINGS: '@sudoku_settings',
  STATISTICS: '@sudoku_statistics',
};

// Game State
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.GAME_STATE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(gameState);
    await AsyncStorage.setItem(KEYS.GAME_STATE, jsonValue);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.GAME_STATE);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};

// Settings
export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(KEYS.SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Statistics
export const loadStatistics = async (): Promise<Statistics | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.STATISTICS);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading statistics:', error);
    return null;
  }
};

export const saveStatistics = async (statistics: Statistics): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(statistics);
    await AsyncStorage.setItem(KEYS.STATISTICS, jsonValue);
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const clearStatistics = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.STATISTICS);
  } catch (error) {
    console.error('Error clearing statistics:', error);
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.GAME_STATE,
      KEYS.SETTINGS,
      KEYS.STATISTICS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
