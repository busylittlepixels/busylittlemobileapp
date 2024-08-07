import React, { useState } from 'react';
import AppNavigator from './navigation';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
// import type { StatusBarStyle } from 'react-native';
import Toast from 'react-native-toast-message';

// const STYLES = ['dark-content', 'light-content', 'default'] as const;
// const TRANSITIONS = ['fade', 'slide', 'none'] as const;

const App = () => {
 
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
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
