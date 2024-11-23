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
import ChatScreen from '../screens/Chat/ChatScreen';
import MyQRCodeScreen from '../screens/MyScreens/MyQRCodeScreen';
import CameraScreen from '../screens/General/CameraScreen'
import MyContacts from '../screens/MyScreens/MyContacts';
import MyPersonalSchedule from '../screens/MyScreens/MyPersonalSchedule';
import CalendarEventScreen from '../screens/MyScreens/CalendarEventScreen';

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
  General: undefined;
  Onboarding: undefined;
  Profile: undefined;
  Calendar: undefined;
  FriendProfile: undefined;
  Chat: undefined;
  Camera: undefined;
  MyQR: undefined;
  MyContacts: undefined,
  CalendarEvent: undefined; 
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const isFirstLaunch = useSelector((state) => state.onboarding.isFirstLaunch);

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
                {/* <Stack.Screen name="Account" component={MainDrawerNavigator} options={{ headerShown: false }} /> */}
                <Stack.Screen name="Account"
                  component={MainDrawerNavigator}
                  options={({ route }) => ({
                    headerShown: false, 
                    gestureEnabled: true, // Enable gesture for swipe back
                    cardStyleInterpolator: route.params?.fromCities
                      ? CardStyleInterpolators.forHorizontalIOS
                      : undefined, // Apply left-to-right transition only if navigating from CitiesScreen
                    gestureDirection: route.params?.fromCities ? 'horizontal-inverted' : 'horizontal', // Slide from left if coming from CitiesScreen
                  })}
                />
                <Stack.Screen name="Profile" 
                  component={ProfileScreen} 
                  options={{ headerTintColor: '#000', headerShown: true, headerBackTitle: 'Back', headerBackTitleVisible: true }} 
                />
                <Stack.Screen name="Event" component={EventScreen} options={{ 
                  gestureEnabled: false,
                  // gestureDirection: 'vertical',
                  // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible/>
                  headerShown: true  
                }} />
                <Stack.Screen name="MyPersonalSchedule" component={MyPersonalSchedule} />
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
                <Stack.Screen name="CalendarEvent" component={CalendarEventScreen} options={({ navigation }) => ({
                  headerShown: true,
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
                <Stack.Screen name="Article" component={ArticleScreen} options={{ headerTintColor: '#000', headerShown: true, headerBackTitle: 'Back', headerBackTitleVisible: true }} />
                <Stack.Screen name="Cities" component={CitiesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="City" component={CityScreen} options={{ headerTintColor: '#000', headerShown: true, headerBackTitle: 'Back', headerBackTitleVisible: true }} />
                <Stack.Screen name="Search" component={SearchScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',  
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
                <Stack.Screen name="Camera" component={CameraScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.navigate('Profile', { screen: 'MyContacts' })} // Navigate to the Profile screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="people-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
                <Stack.Screen name="MyQR" component={MyQRCodeScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible/>
                  headerShown: 'false'
                })} />
                <Stack.Screen name="MyContacts" component={MyContacts} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.navigate('Camera')} // Navigate to the Profile screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="camera-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })}
                />
                <Stack.Screen name="AgendaIrem" component={PaymentScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="General" component={TabEileScreen} 
                  options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.navigate('Profile')} // Navigate to the Profile screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="person-outline" size={24} color="black" />
                      </Pressable>
                      <Pressable
                        onPress={() => navigation.navigate('Search')} // Navigate to the Search screen
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="search-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
                <Stack.Screen name="FriendProfile" component={FriendProfileScreen} options={({ navigation }) => ({
                  gestureEnabled: false,
                  gestureDirection: 'horizontal',
                  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerTitle: 'Contact Info',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.goBack()} 
                        style={{ marginRight: 15 }}
                      >
                        <Ionicons name="close-outline" size={24} color="black" />
                      </Pressable>
                    </View>
                  ),
                })} />
                <Stack.Screen name="Chat" component={ChatScreen} options={({ navigation }) => ({
                  headerShown: true,
                  // gestureEnabled: false,
                  // gestureDirection: 'horizontal',
                  // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // Custom modal animation
                  headerTintColor: '#000',
                  headerBackTitle: 'Back', // Change the back button text
                  headerBackTitleVisible: true, // Ensures the back button text is visible
                  headerRight: () => (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Pressable
                        onPress={() => navigation.goBack()}
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
