import React, { useState } from 'react';
import AppNavigator from './navigation';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import type { StatusBarStyle } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const STYLES = ['dark-content', 'light-content', 'default'] as const;
// const TRANSITIONS = ['fade', 'slide', 'none'] as const;

// const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log('AsyncStorage successfully cleared!');
//   } catch (error) {
//     console.error('Failed to clear the AsyncStorage:', error);
//   }
// };

// clearAsyncStorage();

const App = () => {
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaView>
      <Toast />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Ensure the background color is set to contrast with the StatusBar
  },
});

export default App;
