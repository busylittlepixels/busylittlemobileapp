// @ts-nocheck

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Button, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import AccountScreen from '../screens/AccountScreen';
import ServicesScreen from '../screens/ServicesScreen';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { AuthContext } from '../context/AuthContext';
import MainTabNavigator from './MainTabNavigator';
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import EventScreen from '../screens/EventScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import TabEileScreen from '../screens/TabEileScreen';
import ArticleScreen from '../screens/ArticleScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import Onboarding from 'react-native-onboarding-swiper';
import FavoritesScreen from '../screens/FavoritesScreen';
import CityScreen from '../screens/CityScreen';
import CitiesScreen from '../screens/CitiesScreen';
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Article: undefined;
  Cities: undefined;
  City: undefined;
  Login: undefined;
  SignUp: undefined;
  Search: undefined;
  Event: undefined;
  FavoriteArticles: undefined;
  UpdateDetails: undefined;
  Payment: undefined;
  ResetPass: undefined;
  TabEile: undefined;
  Onboarding: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const isFirstLaunch = useSelector((state) => state.auth.isFirstLaunch);

  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Is First Launch:', isFirstLaunch);

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
      <Stack.Navigator screenOptions={{
          headerShown: true,
        }}>
        {user ? (
          <>
            {isFirstLaunch ? (
              <Stack.Screen name="Onboarding">
                {() => <OnboardingScreen />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Account" component={MainDrawerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={UpdateDetailsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Event" component={EventScreen} options={{ headerShown: true }} />
                <Stack.Screen name="MyEvents" component={MyEventsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Article" component={ArticleScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Cities" component={CitiesScreen} options={{ headerShown: true }} />
                <Stack.Screen name="City" component={CityScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Search" component={SearchScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 15 }}>
                      <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="close-outline" size={24} color="lightblue" />
                      </Pressable>
                    </View>
                  ),
                })}/>
                <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="FavoriteArticles" component={FavoritesScreen} options={{ headerTitle: "Favorite Articles" }} />
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
  )
};

export default AppNavigator;
