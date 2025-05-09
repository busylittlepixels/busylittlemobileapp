import '../app/polyfills';
import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from '../app/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { NotificationProvider, useNotification } from '../app/contexts/NotificationContext';
import NetInfo from '@react-native-community/netinfo';
import { registerForPushNotificationsAsync } from '../app/lib/utils/notificationSetup';

// Main layout component that sets up all providers
export default function RootLayout() {
  // Set up network status listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch({ type: 'SET_NETWORK_STATUS', payload: state.isConnected });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <StripeProvider publishableKey="your-publishable-key">
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.container}>
            <StatusBar style="dark" />
            <NotificationProvider>
              <Slot />
            </NotificationProvider>
            <Toast />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
