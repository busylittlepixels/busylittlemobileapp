import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MySchedule from './../MyScreens/MyEventsFeed';
import UpdateDetailsScreen from './UpdateDetailsScreen';
import AnimatedTabs from '../../components/AnimatedTabs'; // Import your custom AnimatedTabs component
import MySettings from '../MyScreens/MySettings';

const Tab = createBottomTabNavigator();

const ProfileScreen = ({ navigation }:any) => {
  const updateDetailsRef = useRef(null); // Create a ref

  const triggerRefresh = () => {
    if (updateDetailsRef.current) {
      // @ts-ignore
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

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabs {...props} />} // Use the custom AnimatedTabs
        screenOptions={({ route }) => ({
          headerShown: false, // Hide headers within individual screens
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'My Profile') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            // @ts-ignore
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'black',
        })}
      >
        <Tab.Screen
          name="My Profile"
          children={(props) => <UpdateDetailsScreen {...props} ref={updateDetailsRef} />} // Pass the ref and props
          listeners={{
            focus: () => navigation.setOptions({ title: 'Update Profile' }),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
});

export default ProfileScreen;
