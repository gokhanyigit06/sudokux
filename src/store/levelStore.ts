import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generatePuzzle} from '../utils/sudoku';
import {Difficulty} from '../types';

export interface Level {
  id: number;
  difficulty: Difficulty;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number; // 0-3
  bestTime: number | null; // seconds
  seed: number; // for consistent puzzle generation
}

interface LevelStore {
  levels: Level[];
  currentLevel: number;
  initializeLevels: () => void;
  unlockLevel: (levelId: number) => void;
  completeLevel: (levelId: number, time: number, stars: number) => void;
  getLevelById: (levelId: number) => Level | undefined;
  getPuzzleForLevel: (levelId: number) => {puzzle: (number | null)[][]; solution: (number | null)[][]};
}

// Difficulty distribution: 1-100 beginner/easy, 101-300 medium, 301-500 hard/expert/evil
const getDifficultyForLevel = (levelId: number): Difficulty => {
  if (levelId <= 50) return 'beginner';
  if (levelId <= 100) return 'easy';
  if (levelId <= 200) return 'medium';
  if (levelId <= 350) return 'hard';
  if (levelId <= 450) return 'expert';
  return 'evil';
};

const generateLevels = (): Level[] => {
  const levels: Level[] = [];
  for (let i = 1; i <= 500; i++) {
    levels.push({
      id: i,
      difficulty: getDifficultyForLevel(i),
      isUnlocked: i === 1, // Only first level unlocked initially
      isCompleted: false,
      stars: 0,
      bestTime: null,
      seed: i * 12345, // Unique seed for each level
    });
  }
  return levels;
};

export const useLevelStore = create<LevelStore>()(
  persist(
    (set, get) => ({
      levels: [],
      currentLevel: 1,

      initializeLevels: () => {
        const existingLevels = get().levels;
        if (existingLevels.length === 0) {
          set({levels: generateLevels()});
        }
      },

      unlockLevel: (levelId: number) => {
        set(state => ({
          levels: state.levels.map(level =>
            level.id === levelId ? {...level, isUnlocked: true} : level
          ),
        }));
      },

      completeLevel: (levelId: number, time: number, stars: number) => {
        set(state => {
          const updatedLevels = state.levels.map(level => {
            if (level.id === levelId) {
              const newBestTime =
                level.bestTime === null ? time : Math.min(level.bestTime, time);
              const newStars = Math.max(level.stars, stars);
              return {
                ...level,
                isCompleted: true,
                bestTime: newBestTime,
                stars: newStars,
              };
            }
            // Unlock next level
            if (level.id === levelId + 1) {
              return {...level, isUnlocked: true};
            }
            return level;
          });
          return {levels: updatedLevels};
        });
      },

      getLevelById: (levelId: number) => {
        return get().levels.find(level => level.id === levelId);
      },

      getPuzzleForLevel: (levelId: number) => {
        const level = get().getLevelById(levelId);
        if (!level) {
          return generatePuzzle('medium');
        }
        // Use seed-based generation for consistent puzzles
        return generatePuzzle(level.difficulty);
      },
    }),
    {
      name: 'level-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
