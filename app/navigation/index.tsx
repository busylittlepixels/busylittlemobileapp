// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useEffect, useState } from 'react';
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
import MainDrawerNavigator from './MainDrawerNavigator';
import SignUpScreen from '../screens/SignUpScreen';
import EventScreen from '../screens/EventScreen';
import TabEileScreen from '../screens/TabEile';
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
  Account: undefined;
  Search: undefined;
  Event: undefined;
  FavoriteArticles: undefined;
  UpdateDetails: undefined;
  Payment: undefined;
  ResetPass: undefined;
  TabEile: undefined;
  Onboarding: undefined;
  Services: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();


const OnboardingScreen = ({ onDone, user }) => {

  const [userId, setUserId] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);


  const handleCityChange = (city) => {
    setSelectedCities((prevCities) => {
      if (prevCities.includes(city)) {
        return prevCities.filter((item) => item !== city);
      } else {
        return [...prevCities, city];
      }
    });
  };

  const handleOnDone = () => {
    console.log('Onboarding Cities:', selectedCities);
    console.log('Onboarding User:', userId);
    onDone(user, selectedCities);
  };

  useEffect(() => {
    if(user){
      setUserId(user.id)
    }
  }, [user]);

  return (
    <Onboarding
      onSkip={handleOnDone}
      onDone={handleOnDone}
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
          image: <Text>✨{user ? user.id : 'WELCOME!'}</Text>,
          title: (
            <View style={{ alignItems: 'center' }}>
              <Text>Select Your City</Text>
            </View>
          ),
          subtitle: (
            <View>
              <Picker
                selectedValue={selectedCities}
                onValueChange={(itemValue) => handleCityChange(itemValue)}
                multiple={true}
              >
                <Picker.Item label="Amsterdam" value="Amsterdam" />
                <Picker.Item label="London" value="London" />
                <Picker.Item label="Hamburg" value="Hamburg" />
                <Picker.Item label="Vienna" value="Vienna" />
                <Picker.Item label="Bogota" value="Bogota" />
                <Picker.Item label="New York" value="New York" />
                <Picker.Item label="Dublin" value="Dublin" />
                {/* Add more cities as needed */}
              </Picker>
              <Button title="Finish Onboarding" onPress={handleOnDone} />
              </View>
          ),
        },
      ]}
    />
  );
};

// const clearOnboardingFlag = async () => {
//   try {
//     await AsyncStorage.removeItem('hasLaunched');
//     console.log('Onboarding flag cleared');
//   } catch (error) {
//     console.error('Error clearing onboarding flag:', error);
//   }
// };

const AppNavigator = () => {
  const { user, loading, isFirstLaunch, completeOnboarding } = useContext(AuthContext);
  // const navigation = useNavigation(); 

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
                {() => <OnboardingScreen onDone={completeOnboarding} user={user} />}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen name="Account" component={MainDrawerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={UpdateDetailsScreen} options={{ headerShown: true }} />
                <Stack.Screen name="Event" component={EventScreen} options={{ headerShown: true }} />
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
  );
};

export default AppNavigator;

// clearOnboardingFlag();