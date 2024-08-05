import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import AccountScreen from '../screens/AccountScreen';
import ServicesScreen from '../screens/ServicesScreen';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { AuthContext } from '../context/AuthContext';
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Account: undefined;
  Services: undefined;
  UpdateDetails: undefined;
  Payment: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <NavigationContainer independent>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Account" component={MainDrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
