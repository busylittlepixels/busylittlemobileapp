// @ts-nocheck

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Button, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/Login/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import AccountScreen from '../screens/Account/AccountScreen';
import ServicesScreen from '../screens/Services/ServicesScreen';
import UpdateDetailsScreen from '../screens/Profile/UpdateDetailsScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import MainTabNavigator from './MainTabNavigator';
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import EventScreen from '../screens/Events/EventScreen';
import MyEventsScreen from '../screens/MyScreens/MyEventsScreen';
import TabEileScreen from '../screens/General/TabEileScreen';
import ArticleScreen from '../screens/Article/ArticleScreen';
import ResetPassScreen from '../screens/Auth/ResetPassScreen';
import Onboarding from 'react-native-onboarding-swiper';
import FavoritesScreen from '../screens/Favourites/FavoritesScreen';
import CityScreen from '../screens/Cities/CityScreen';
import CitiesScreen from '../screens/Cities/CitiesScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import OnboardingScreen from '../screens/Login/OnboardingScreen';
import SettingsScreen from '../screens/General/SettingsScreen';
import FriendProfileScreen from '../screens/Friends/FriendProfileScreen';

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
  Calendar: undefined;
  FriendProfile: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const isFirstLaunch = useSelector((state) => state.auth.isFirstLaunch);

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
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerTintColor: '#000', headerShown: true }} />
                <Stack.Screen name="Event" component={EventScreen} options={{ headerShown: true }} />
                <Stack.Screen name="MyEvents" component={MyEventsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Calendar" component={SettingsScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Go Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                    headerRight: () => (
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Pressable
                        onPress={() => navigation.goBack()} // Navigate to the Search screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="close-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
                <Stack.Screen name="Article" component={ArticleScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Cities" component={CitiesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="City" component={CityScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Search" component={SearchScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000', // 
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.goBack()} // Navigate to the Search screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="close-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
                <Stack.Screen name="UpdateDetails" component={UpdateDetailsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="TabEile" component={TabEileScreen} />
                <Stack.Screen name="FriendProfile" component={FriendProfileScreen} options={({ navigation }) => ({
                  // gestureEnabled: false,
                  // gestureDirection: 'horizontal',
                  // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerTitle: 'Friend Profile',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                    headerRight: () => (
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Pressable
                        onPress={() => navigation.goBack()} // Navigate to the Search screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="close-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
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
