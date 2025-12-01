import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LivesStore {
  lives: number;
  maxLives: number;
  lastLifeLostTime: number | null;
  loseLife: () => void;
  addLife: () => void;
  getNextLifeTime: () => number; // seconds until next life
  updateLives: () => void; // Check and regenerate lives
}

const LIFE_REGEN_TIME = 30 * 60; // 30 minutes in seconds

export const useLivesStore = create<LivesStore>()(
  persist(
    (set, get) => ({
      lives: 5,
      maxLives: 5,
      lastLifeLostTime: null,

      loseLife: () => {
        set(state => {
          if (state.lives > 0) {
            return {
              lives: state.lives - 1,
              lastLifeLostTime: state.lives === state.maxLives ? Date.now() : state.lastLifeLostTime,
            };
          }
          return state;
        });
      },

      addLife: () => {
        set(state => {
          if (state.lives < state.maxLives) {
            return {
              lives: state.lives + 1,
              lastLifeLostTime: state.lives + 1 === state.maxLives ? null : state.lastLifeLostTime,
            };
          }
          return state;
        });
      },

      getNextLifeTime: () => {
        const {lives, maxLives, lastLifeLostTime} = get();
        
        if (lives >= maxLives || lastLifeLostTime === null) {
          return 0;
        }

        const now = Date.now();
        const timeSinceLoss = Math.floor((now - lastLifeLostTime) / 1000);
        const livesRegened = Math.floor(timeSinceLoss / LIFE_REGEN_TIME);
        const timeUntilNext = LIFE_REGEN_TIME - (timeSinceLoss % LIFE_REGEN_TIME);

        return timeUntilNext;
      },

      updateLives: () => {
        const {lives, maxLives, lastLifeLostTime} = get();
        
        if (lives >= maxLives || lastLifeLostTime === null) {
          return;
        }

        const now = Date.now();
        const timeSinceLoss = Math.floor((now - lastLifeLostTime) / 1000);
        const livesRegened = Math.floor(timeSinceLoss / LIFE_REGEN_TIME);

        if (livesRegened > 0) {
          const newLives = Math.min(lives + livesRegened, maxLives);
          set({
            lives: newLives,
            lastLifeLostTime: newLives === maxLives ? null : lastLifeLostTime + (livesRegened * LIFE_REGEN_TIME * 1000),
          });
        }
      },
    }),
    {
      name: 'lives-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
