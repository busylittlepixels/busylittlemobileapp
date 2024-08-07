import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/PaymentScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/UpdateDetailsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DrawerToggle = ({ navigation }:any) => (
  <Pressable onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
    <Ionicons name="menu" size={24} color="black" />
  </Pressable>
);

const screenOptions = ({ navigation }:any) => ({
  headerLeft: () => <DrawerToggle navigation={navigation} />,
  headerShown: false 
});

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={screenOptions} />
  </Stack.Navigator>
);

const SettingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={SettingsScreen} options={screenOptions} />
  </Stack.Navigator>
);

const OnboardingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} options={screenOptions} />
  </Stack.Navigator>
);

const SettingsTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="About" component={OnboardingStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
      <Tab.Screen name="Onboarding" component={OnboardingStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default SettingsTabNavigator;
