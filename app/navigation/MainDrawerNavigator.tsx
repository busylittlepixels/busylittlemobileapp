import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import SettingsTabNavigator from './SettingsTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OnboardingTabNavigator from './OnboardingTabNavigator';

import { StyleSheet, Image, Platform, TouchableOpacity, Text } from 'react-native';


const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="My Account" component={MainTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Onboarding" component={OnboardingTabNavigator} />
    </Drawer.Navigator>
    
  );
};

export default MainDrawerNavigator;
