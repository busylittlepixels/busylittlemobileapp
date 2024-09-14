// @ts-nocheck
import React, { useEffect, useState } from 'react';
import AppNavigator from './navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import store from './store';
import NetInfo from '@react-native-community/netinfo';
import { registerForPushNotificationsAsync, sendPushNotification } from './lib/utils/notificationSetup';


const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage successfully cleared!');
  } catch (error) {
    console.error('Failed to clear the AsyncStorage:', error);
  }
};

// Method to check and log AsyncStorage contents
const checkAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.log(result); // Logs all keys and their values
  } catch (error) {
    console.error('Failed to load AsyncStorage data:', error);
  }
};

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch({ type: 'SET_NETWORK_STATUS', payload: state.isConnected });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to send push notifications globally
  const handleSendPushNotification = async (title, body, data) => {
    if (!expoPushToken) {
      console.error('Expo push token is not available');
      return;
    }
    try {
      await sendPushNotification(expoPushToken, title, body, data);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <StripeProvider publishableKey="your-publishable-key">
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          <Provider store={store}>
            {/* Pass down the notification handler and expoPushToken to AppNavigator */}
            <AppNavigator expoPushToken={expoPushToken} handleSendPushNotification={{handleSendPushNotification}} />
          
          </Provider>
          <Toast />
        </SafeAreaView>
      </SafeAreaProvider>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;

// checkAsyncStorage(); // Uncomment to log storage contents
// clearAsyncStorage(); // Uncomment to clear storage on each launch
