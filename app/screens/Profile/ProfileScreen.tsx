// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Platform} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MySchedule from './../MyScreens/MyEventsFeed';
import UpdateDetailsScreen from './UpdateDetailsScreen';
import AnimatedTabs from '../../components/AnimatedTabs';
import MySettings from '../MyScreens/MySettings';
import MyContacts from '../MyScreens/MyContacts';
import MessagesScreen from '../Chat/MessagesScreen';
import { supabase } from '../../../supabase'; // Adjust path as necessary
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { useFocusEffect } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const ProfileScreen = ({ navigation, route }:any) => {
  const updateDetailsRef = useRef(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // Unread message count state
  const user = useSelector((state) => state.auth.user);
  const tabsRef = useRef(null);
  const { expoPushToken, handleSendPushNotification } = route.params || {};
  
  const triggerRefresh = () => {
    if (updateDetailsRef.current) {
      updateDetailsRef.current.triggerRefresh(); // Call the refresh method on UpdateDetailsScreen
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
          <Pressable onPress={triggerRefresh}>
            <Ionicons name="refresh-outline" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const fetchUnreadMessagesCount = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('id') // Only need to fetch the id for counting
      .eq('receiver_id', user?.id) // Adjust this with the logged-in user's ID
      .eq('read', false); // Only fetch unread messages
  
    if (error) {
      console.error('Error fetching unread messages:', error);
    } else {
      setUnreadMessagesCount(data.length); // Set the unread count
    }
  };

  useEffect(() => {
    fetchUnreadMessagesCount(); // Fetch unread count on component mount

    const intervalId = setInterval(fetchUnreadMessagesCount, 5000); // Poll every 5 seconds for unread messages
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.screen === 'Messages') {
        // Assuming 'Messages' is the second tab (index 1)
        tabsRef.current?.setTabIndex(1);
      }
    }, [route.params?.screen])
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabs {...props} unreadMessagesCount={unreadMessagesCount} ref={tabsRef} /> } // Pass unread count
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            paddingBottom: 10,
            backgroundColor: '#fff',
            borderTopWidth: 0,
          },
        })}
      >
        <Tab.Screen
          name="My Profile"
          children={(props) => <UpdateDetailsScreen {...props} ref={updateDetailsRef} />}
          listeners={{
            focus: () => navigation.setOptions({ title: 'Update Profile' }),
          }}
        />
        <Tab.Screen
          name="Messages"
          initialParams={{ expoPushToken, handleSendPushNotification }}
          component={MessagesScreen}
          listeners={{
            focus: () => navigation.setOptions({ title: 'Messages' }),
          }}
        />

        <Tab.Screen
          name="Contacts"
          component={MyContacts}
          listeners={{
            focus: () => navigation.setOptions({ title: 'Scanned Contacts' }),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={MySettings}
          listeners={{
            focus: () => navigation.setOptions({ title: 'Settings' }),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default ProfileScreen;
