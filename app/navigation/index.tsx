// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import AccountScreen from '../screens/AccountScreen';
import ServicesScreen from '../screens/ServicesScreen';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { AuthContext } from '../context/AuthContext';
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import EventScreen from '../screens/EventScreen';
import TabEileScreen from '../screens/TabEile';
import ArticleScreen from '../screens/ArticleScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import Onboarding from 'react-native-onboarding-swiper';
import FavoritesScreen from '../screens/FavoritesScreen';
import FavoriteSingleScreen from '../screens/FavoriteSingleScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Article: undefined;
  Login: undefined;
  SignUp: undefined;
  Account: undefined;
  Services: undefined;
  Event: undefined;
  FavoriteArticles: undefined;
  FavoriteSingle: undefined;
  UpdateDetails: undefined;
  Payment: undefined;
  ResetPass: undefined;
  TabEile: undefined;
  Onboarding: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const OnboardingScreen = ({ onDone }) => (
  <Onboarding
    onSkip={onDone}
    onDone={onDone}
    pages={[
      {
        backgroundColor: '#000',
        image: <Text>🎉</Text>,
        title: 'Onboarding Step 1',
        subtitle: 'Description of Step 1',
      },
      {
        backgroundColor: '#fe6e58',
        image: <Text>🚀</Text>,
        title: 'Onboarding Step 2',
        subtitle: 'Description of Step 2',
      },
      {
        backgroundColor: '#999',
        image: <Text>✨</Text>,
        title: 'Onboarding Step 3',
        subtitle: 'Description of Step 3',
      },
    ]}
  />
);

const clearOnboardingFlag = async () => {
  try {
    await AsyncStorage.removeItem('hasLaunched');
    console.log('Onboarding flag cleared');
  } catch (error) {
    console.error('Error clearing onboarding flag:', error);
  }
};

const AppNavigator = () => {
  const { user, loading, isFirstLaunch, completeOnboarding } = useContext(AuthContext);

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
            {isFirstLaunch ? (
              <Stack.Screen name="Onboarding">
                {() => <OnboardingScreen onDone={completeOnboarding} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Account" component={MainDrawerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Event" component={EventScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Article" component={ArticleScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Services" component={ServicesScreen} />
                <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="FavoriteArticles" component={FavoritesScreen} />
                <Stack.Screen name="FavoriteSingle" component={FavoriteSingleScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="TabEile" component={TabEileScreen} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPass" component={ResetPassScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// clearOnboardingFlag();