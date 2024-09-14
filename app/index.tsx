// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to get user from Redux
import AppNavigator from './navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux'; // Make sure Provider is correctly imported
import { StripeProvider } from '@stripe/stripe-react-native';
import store from './store';
import NetInfo from '@react-native-community/netinfo';
import { registerForPushNotificationsAsync, sendPushNotification } from './lib/utils/notificationSetup';
import { supabase } from '@/supabase'; // Assuming supabase is set up
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add AsyncStorage back

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
    // Register for push notifications when the app loads
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Monitor network connectivity status
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch({ type: 'SET_NETWORK_STATUS', payload: state.isConnected });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get the current user from Redux store
  const user = useSelector((state) => state.auth.user); // Assuming user is stored in state.auth.user

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

  // Example: Inside your real-time listener where messages are received
  useEffect(() => {
    const setupSubscription = async () => {
      const channel = supabase
        .channel('messages_channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          async (payload) => {
            const currentUserId = user?.id; // Get the current user's ID from Redux

            // Check if the current user is the receiver, not the sender
            if (payload.new.receiver_id === currentUserId) {
              // Fetch sender's name
              const { data: senderData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.sender_id)
                .single();
              
              const senderName = senderData?.full_name || 'Someone';
              
              // Send push notification to the receiver only
              await handleSendPushNotification(
                'New Message',
                `${senderName}: ${payload.new.message}`,
                { messageId: payload.new.id }
              );
            }
          }
        )
        .subscribe();

      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    };

    if (user) { // Only set up the subscription if user is logged in
      setupSubscription();
    }
  }, [user, expoPushToken]);

  return (
    <Provider store={store}> {/* Ensure that the Provider wraps everything */}
      <StripeProvider publishableKey="your-publishable-key">
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <AppNavigator 
              expoPushToken={expoPushToken} 
              handleSendPushNotification={handleSendPushNotification} 
              user={user} // Pass the user to AppNavigator
            />
            <Toast />
          </SafeAreaView>
        </SafeAreaProvider>
      </StripeProvider>
    </Provider>
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
