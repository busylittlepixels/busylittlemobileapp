import React from 'react';
// @ts-ignore
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import TabTwoScreen from '../screens/TabTwo';
import TabEileScreen from '../screens/TabEile';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';

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

// const HomeStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Home" component={HomeScreen} options={screenOptions} />
//   </Stack.Navigator>
// );

// const ProfileStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Profile" component={ProfileScreen} options={screenOptions} />
//   </Stack.Navigator>
// );

const SettingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} options={screenOptions} />
  </Stack.Navigator>
);

// const OnboardingStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Onboarding Stack" component={OnboardingScreen} options={screenOptions} />
//   </Stack.Navigator>
// );

const TabsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Two" component={TabTwoScreen} options={screenOptions} />
    <Stack.Screen name="Eile" component={TabEileScreen} options={screenOptions} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      {/* @ts-ignore */}
      <Tab.Screen name="Me" component={UpdateDetailsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Events" component={TabsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Notifications" component={TabEileScreen} options={{ headerShown: false, tabBarBadge: 2 }} />
      
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
