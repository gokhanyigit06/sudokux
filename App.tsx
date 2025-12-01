import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import mobileAds from 'react-native-google-mobile-ads';

function App() {
  useEffect(() => {
    // Initialize AdMob SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('AdMob initialization error:', error);
      });
  }, []);

  return <AppNavigator />;
}

export default App;
