import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import FavoritesScreen from './FavoritesScreen';

// Sample Screens for the Tab Navigator
const EventsList = () => (
  <View style={styles.container}>
    <Text>Events List</Text>
  </View>
);

const Favorites = () => (
  <View style={styles.container}>
    <Text>Favorites</Text>
  </View>
);

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

const MyEventsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
     <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,  // Hide header for all tabs
        })}
      >
        <Tab.Screen name="Events" component={EventsList} 
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'newspaper' : 'newspaper-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen name="All Events" component={FavoritesScreen} 
         options={{
           tabBarIcon: ({ focused, color, size }) => (
             <Ionicons 
               name={focused ? 'calendar' : 'calendar-outline'} 
               size={size} 
               color={color} 
             />
           ),
         }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});

export default MyEventsScreen;
