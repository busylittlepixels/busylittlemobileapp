// @ts-nocheck
import React from 'react';
import AppNavigator from './navigation';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
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

const checkAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    console.log(result); // Logs all keys and their values
  } catch (error) {
    console.error('Failed to load AsyncStorage data:', error);
  }
};

checkAsyncStorage();

const App = () => {
 
  return (
    <SafeAreaProvider>
      
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor="light" />
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
    backgroundColor: 'white',
  },
});

export default App;
