// @ts-nocheck
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import AppNavigator from './navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import store from './store';
import NetInfo from '@react-native-community/netinfo';
import { registerForPushNotificationsAsync } from './lib/utils/notificationSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMessageSubscription } from './hooks/useMessageSubscription';
import { useSelector } from 'react-redux';

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

  const user = useSelector((state) => state.auth?.user);
  const loading = useSelector((state) => state.auth?.loading);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AppContent />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
});

export default App;

// Uncomment these lines to use the AsyncStorage functions
checkAsyncStorage(); // Uncomment to log storage contents
clearAsyncStorage(); // Uncomment to clear storage on each launch