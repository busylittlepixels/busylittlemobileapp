import '../app/polyfills';
import React from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../app/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Main layout component that just sets up providers
export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey="your-publishable-key">
        <SafeAreaProvider>
          <GestureHandlerRootView style={styles.container}>
            <StatusBar style="dark" />
            <Slot />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 