import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AdsState {
  // Ad loaded states
  rewardedAdLoaded: boolean;
  interstitialAdLoaded: boolean;

  // Ad show counts
  totalRewardedAdsWatched: number;
  totalInterstitialAdsShown: number;
  levelsCompletedSinceLastAd: number;

  // Settings
  adsEnabled: boolean;
  interstitialFrequency: number; // Show interstitial every N levels

  // Actions
  setRewardedAdLoaded: (loaded: boolean) => void;
  setInterstitialAdLoaded: (loaded: boolean) => void;
  incrementRewardedAdsWatched: () => void;
  incrementInterstitialAdsShown: () => void;
  incrementLevelsCompleted: () => void;
  resetLevelCounter: () => void;
  shouldShowInterstitial: () => boolean;
  setAdsEnabled: (enabled: boolean) => void;
  setInterstitialFrequency: (frequency: number) => void;
}

export const useAdsStore = create<AdsState>()(
  persist(
    (set, get) => ({
      // Initial state
      rewardedAdLoaded: false,
      interstitialAdLoaded: false,
      totalRewardedAdsWatched: 0,
      totalInterstitialAdsShown: 0,
      levelsCompletedSinceLastAd: 0,
      adsEnabled: true,
      interstitialFrequency: 3, // Default: show ad every 3 levels

      // Actions
      setRewardedAdLoaded: (loaded: boolean) => set({rewardedAdLoaded: loaded}),
      
      setInterstitialAdLoaded: (loaded: boolean) => set({interstitialAdLoaded: loaded}),
      
      incrementRewardedAdsWatched: () =>
        set(state => ({
          totalRewardedAdsWatched: state.totalRewardedAdsWatched + 1,
        })),
      
      incrementInterstitialAdsShown: () =>
        set(state => ({
          totalInterstitialAdsShown: state.totalInterstitialAdsShown + 1,
        })),
      
      incrementLevelsCompleted: () =>
        set(state => ({
          levelsCompletedSinceLastAd: state.levelsCompletedSinceLastAd + 1,
        })),
      
      resetLevelCounter: () => set({levelsCompletedSinceLastAd: 0}),
      
      shouldShowInterstitial: () => {
        const state = get();
        if (!state.adsEnabled) {
          return false;
        }
        return state.levelsCompletedSinceLastAd >= state.interstitialFrequency;
      },
      
      setAdsEnabled: (enabled: boolean) => set({adsEnabled: enabled}),
      
      setInterstitialFrequency: (frequency: number) => 
        set({interstitialFrequency: frequency}),
    }),
    {
      name: 'ads-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
