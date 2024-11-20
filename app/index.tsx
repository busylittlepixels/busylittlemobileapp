// @ts-nocheck
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import AppNavigator from './navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import store from './store';
import NetInfo from '@react-native-community/netinfo';
import { registerForPushNotificationsAsync } from './lib/utils/notificationSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMessageSubscription } from './hooks/useMessageSubscription';

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

const AppContent = () => {
  const { setExpoPushToken } = useNotification();

  useMessageSubscription(); // Add this line
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });
  }, []);

    return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

const App = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch({ type: 'SET_NETWORK_STATUS', payload: state.isConnected });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <StripeProvider publishableKey="your-publishable-key">
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
            <Provider store={store}>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
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

// Uncomment these lines to use the AsyncStorage functions
checkAsyncStorage(); // Uncomment to log storage contents
// clearAsyncStorage(); // Uncomment to clear storage on each launch