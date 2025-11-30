import {create} from 'zustand';
import {Difficulty, Statistics} from '../types';
import {loadStatistics, saveStatistics} from '../utils/storage';

const emptyDifficultyStats = {
  beginner: 0,
  easy: 0,
  medium: 0,
  hard: 0,
  expert: 0,
  evil: 0,
};

const emptyDifficultyTimes = {
  beginner: Infinity,
  easy: Infinity,
  medium: Infinity,
  hard: Infinity,
  expert: Infinity,
  evil: Infinity,
};

interface StatisticsStore extends Statistics {
  // Actions
  recordGameStart: (difficulty: Difficulty) => void;
  recordGameComplete: (difficulty: Difficulty, time: number) => void;
  updateStreak: (won: boolean) => void;
  addPlayTime: (seconds: number) => void;
  loadStatistics: () => Promise<void>;
  resetStatistics: () => void;
}

const defaultStatistics: Statistics = {
  gamesPlayed: {...emptyDifficultyStats},
  gamesCompleted: {...emptyDifficultyStats},
  bestTimes: {...emptyDifficultyTimes},
  averageTimes: {...emptyDifficultyTimes},
  currentStreak: 0,
  longestStreak: 0,
  totalPlayTime: 0,
};

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  ...defaultStatistics,

  recordGameStart: (difficulty) => {
    set((state) => ({
      gamesPlayed: {
        ...state.gamesPlayed,
        [difficulty]: state.gamesPlayed[difficulty] + 1,
      },
    }));
    saveStatistics(get());
  },

  recordGameComplete: (difficulty, time) => {
    set((state) => {
      const completedCount = state.gamesCompleted[difficulty] + 1;
      const currentBest = state.bestTimes[difficulty];
      const newBest = Math.min(currentBest, time);

      // Calculate new average
      const currentAvg = state.averageTimes[difficulty];
      const newAvg =
        currentAvg === Infinity
          ? time
          : (currentAvg * (completedCount - 1) + time) / completedCount;

      return {
        gamesCompleted: {
          ...state.gamesCompleted,
          [difficulty]: completedCount,
        },
        bestTimes: {
          ...state.bestTimes,
          [difficulty]: newBest,
        },
        averageTimes: {
          ...state.averageTimes,
          [difficulty]: newAvg,
        },
      };
    });
    saveStatistics(get());
  },

  updateStreak: (won) => {
    set((state) => {
      if (won) {
        const newStreak = state.currentStreak + 1;
        return {
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
        };
      } else {
        return {
          currentStreak: 0,
        };
      }
    });
    saveStatistics(get());
  },

  addPlayTime: (seconds) => {
    set((state) => ({
      totalPlayTime: state.totalPlayTime + seconds,
    }));
    saveStatistics(get());
  },

  loadStatistics: async () => {
    const statistics = await loadStatistics();
    if (statistics) {
      set(statistics);
    }
  },

  resetStatistics: () => {
    set(defaultStatistics);
    saveStatistics(defaultStatistics);
  },
}));
