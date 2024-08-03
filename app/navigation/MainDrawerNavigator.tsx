import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import SettingsTabNavigator from './SettingsTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OnboardingTabNavigator from './OnboardingTabNavigator';


const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Tabs">
      <Drawer.Screen name="Home" component={MainTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Onboarding" component={OnboardingTabNavigator} />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
