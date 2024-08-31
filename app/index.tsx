// @ts-nocheck
import React, { useEffect } from 'react';
import AppNavigator from './navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import store from './store'; // Import the Redux store

// Method to clear all data from AsyncStorage
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

  useEffect(() => {
    StatusBar.setBarStyle('dark-content'); // Ensures that the bar style is set correctly after mount
    StatusBar.setHidden(false); // Ensures that the StatusBar is visible
  }, []);


  return (
    <>
      <StripeProvider publishableKey="pk_test_51PQaYdBXlSvXkMpQNKlp1h4yvqCUsPhKdTP8ntBKLPt85MgUCvg9leRwKhnc5i4q8VvlZl6Finfu6hsKGYpDUoDd00W6scKuzG">
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="dark" />
          <Provider store={store}>
            <SafeAreaView style={styles.safeArea}>
              <AppNavigator />
            </SafeAreaView>
          </Provider>
          <Toast />
        </SafeAreaProvider>
      </StripeProvider>
    </>
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
