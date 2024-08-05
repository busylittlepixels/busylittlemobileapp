import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/PaymentScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/UpdateDetailsScreen';
import TabTwoScreen from '../screens/TabTwo';
import TabEileScreen from '../screens/TabEile';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DrawerToggle = ({ navigation }:any) => (
  <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
    <Ionicons name="menu" size={24} color="black" />
  </TouchableOpacity>
);

const screenOptions = ({ navigation }:any) => ({
  headerLeft: () => <DrawerToggle navigation={navigation} />,
  headerShown: false
});

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={screenOptions} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={screenOptions} />
  </Stack.Navigator>
);

const SettingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} options={screenOptions} />
  </Stack.Navigator>
);

const OnboardingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Onboarding Stack" component={OnboardingScreen} options={screenOptions} />
  </Stack.Navigator>
);

const TabsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Two" component={TabTwoScreen} options={screenOptions} />
    <Stack.Screen name="Eile" component={TabEileScreen} options={screenOptions} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Settings" component={SettingStack} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} /> */}
      <Tab.Screen name="Notifications" component={TabEileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
