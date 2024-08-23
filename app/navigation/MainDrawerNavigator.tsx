// @ts-nocheck
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any other icon library you are using
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { logout } from '../actions/authActions'; // Import the logout action
import MainTabNavigator from './__MainTabNavigator';
import AccountScreen from '../screens/Account/AccountScreen';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';
import FavoritesScreen from '../screens/Favourites/FavoritesScreen';
import CityScreen from '../screens/Cities/CityScreen';
import CitiesScreen from '../screens/Cities/CitiesScreen';
import MyEventsScreen from '../screens/MyScreens/MyEventsScreen';

const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const navigation = useNavigation();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigation.navigate('Login'); // Navigate to login screen or any other screen after logout
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: '#000', // Change this to your desired color
        headerRight: () => (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Pressable
              onPress={() => navigation.navigate('Profile')} // Navigate to the Profile screen
              style={{ marginRight: 15 }}
            >
              <Ionicons name="person-outline" size={24} color="black" />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Search')} // Navigate to the Search screen
              style={{ marginRight: 15 }}
            >
              <Ionicons name="search-outline" size={24} color="black" />
            </Pressable>
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Home" component={AccountScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="Cities" component={CitiesScreen} />
      <Drawer.Screen name="My Events" component={MyEventsScreen} options={{ drawerLabel: 'My Events' }}/>
      <Drawer.Screen
        name="Logout"
        component={AccountScreen} // Or any dummy component
        options={{ drawerLabel: 'Logout' }}
        listeners={{
          drawerItemPress: () => {
            handleLogout(); // Call the logout handler
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
