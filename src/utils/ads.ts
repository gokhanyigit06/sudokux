import {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {useAdsStore} from '../store/adsStore';

// Test Ad Unit IDs (use these for development)
// For production, replace with real AdMob IDs from Google AdMob console
const REWARDED_AD_ID = __DEV__ 
  ? TestIds.REWARDED 
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your production ID

const INTERSTITIAL_AD_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your production ID

// Create ad instances
let rewardedAd: RewardedAd | null = null;
let interstitialAd: InterstitialAd | null = null;

/**
 * Initialize and load rewarded ad
 */
export const loadRewardedAd = (onAdLoaded?: () => void): void => {
  rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_ID, {
    requestNonPersonalizedAdsOnly: false,
  });

  const unsubscribeLoaded = rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      useAdsStore.getState().setRewardedAdLoaded(true);
      console.log('Rewarded ad loaded');
      onAdLoaded?.();
      unsubscribeLoaded();
    },
  );

  rewardedAd.load();
};

/**
 * Show rewarded ad
 * @param onRewarded Callback when user earns reward
 * @param onClosed Callback when ad is closed
 */
export const showRewardedAd = (
  onRewarded: () => void,
  onClosed?: () => void,
): void => {
  if (!rewardedAd) {
    console.warn('Rewarded ad not loaded yet');
    loadRewardedAd();
    return;
  }

  const unsubscribeEarned = rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      console.log('User earned reward:', reward);
      useAdsStore.getState().incrementRewardedAdsWatched();
      onRewarded();
      unsubscribeEarned();
    },
  );

  const unsubscribeClosed = rewardedAd.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      console.log('Rewarded ad closed');
      useAdsStore.getState().setRewardedAdLoaded(false);
      onClosed?.();
      unsubscribeClosed();
      // Preload next ad
      loadRewardedAd();
    },
  );

  rewardedAd.show();
};

/**
 * Initialize and load interstitial ad
 */
export const loadInterstitialAd = (onAdLoaded?: () => void): void => {
  interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID, {
    requestNonPersonalizedAdsOnly: false,
  });

  const unsubscribeLoaded = interstitialAd.addAdEventListener(
    AdEventType.LOADED,
    () => {
      useAdsStore.getState().setInterstitialAdLoaded(true);
      console.log('Interstitial ad loaded');
      onAdLoaded?.();
      unsubscribeLoaded();
    },
  );

  interstitialAd.load();
};

/**
 * Show interstitial ad
 * @param onClosed Callback when ad is closed
 */
export const showInterstitialAd = (onClosed?: () => void): void => {
  if (!interstitialAd) {
    console.warn('Interstitial ad not loaded yet');
    loadInterstitialAd();
    return;
  }

  const unsubscribeClosed = interstitialAd.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      console.log('Interstitial ad closed');
      useAdsStore.getState().setInterstitialAdLoaded(false);
      useAdsStore.getState().incrementInterstitialAdsShown();
      useAdsStore.getState().resetLevelCounter();
      onClosed?.();
      unsubscribeClosed();
      // Preload next ad
      loadInterstitialAd();
    },
  );

  interstitialAd.show();
};

/**
 * Preload ads on app start
 */
export const preloadAds = (): void => {
  loadRewardedAd();
  loadInterstitialAd();
};

/**
 * Check if rewarded ad is ready to show
 */
export const isRewardedAdReady = (): boolean => {
  return useAdsStore.getState().rewardedAdLoaded;
};

/**
 * Check if interstitial ad is ready to show
 */
export const isInterstitialAdReady = (): boolean => {
  return useAdsStore.getState().interstitialAdLoaded;
};
