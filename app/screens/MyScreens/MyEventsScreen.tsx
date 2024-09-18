import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MyEventsFeed from './MyEventsFeed';
import MySchedule from './MySavedEvents';
import { useNavigation } from '@react-navigation/native';

// Tab Navigator
const Tab = createBottomTabNavigator();

const MyEventsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,  // Hide the default header for all tabs
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'My Feed') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'My Schedule') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }
// @ts-ignore
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="My Feed"
          component={MyEventsFeed}
          listeners={{
            focus: () => navigation.setOptions({ title: 'My Feed' }), // Update header title when focused
          }}
        />
        <Tab.Screen
          name="My Schedule"
          component={MySchedule}
          listeners={{
            focus: () => navigation.setOptions({ title: 'My Schedule' }), // Update header title when focused
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
  },
});

export default MyEventsScreen;
