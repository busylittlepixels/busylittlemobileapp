import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import MainDrawerNavigator from './MainDrawerNavigator';
import AccountScreen from '../screens/AccountScreen';
import ProfileScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator();


const defaultScreenOptions = {
  headerShown: false,
  headerStyle: {
    backgroundColor: '#f4511e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const MainStackNavigator = () => {
  return (
    // @ts-ignore
    <Stack.Navigator screenOptions={defaultScreenOptions} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={MainDrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
