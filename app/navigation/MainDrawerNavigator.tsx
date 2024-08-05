import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import SettingsTabNavigator from './SettingsTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/UpdateDetailsScreen';
import OnboardingTabNavigator from './OnboardingTabNavigator';

import { StyleSheet, Image, Platform, TouchableOpacity, Text } from 'react-native';
import HomeScreen from '@/app-example/(tabs)';
import AccountScreen from '../screens/AccountScreen';


const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={AccountScreen} />
      <Drawer.Screen name="Settings" component={MainTabNavigator} />
      <Drawer.Screen name="Onboarding" component={OnboardingTabNavigator} />
    </Drawer.Navigator>
    
  );
};

export default MainDrawerNavigator;
