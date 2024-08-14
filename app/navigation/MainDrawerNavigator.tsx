// @ts-nocheck
import { useContext } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or any other icon library you are using
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabNavigator from './MainTabNavigator';
import AccountScreen from '../screens/AccountScreen';
import UpdateDetailsScreen from '../screens/UpdateDetailsScreen';
import { AuthContext } from '../context/AuthContext';
import FavoritesScreen from '../screens/FavoritesScreen';
import CityScreen from '../screens/CityScreen';
import CitiesScreen from '../screens/CitiesScreen';

const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => (
          <View style={{ display: 'flex', flexDirection: 'row'}}>
            <Pressable
              onPress={() => navigation.navigate('Profile')} // Replace 'Settings' with the route name of your settings screen
              style={{ marginRight: 15 }}
            >
              <Ionicons name="person-outline" size={24} color="lightblue" />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Search')} // Replace 'Settings' with the route name of your settings screen
              style={{ marginRight: 15 }}
            >
              <Ionicons name="search-outline" size={24} color="lightblue" />
            </Pressable>
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Home" component={AccountScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="Cities" component={CitiesScreen} />
      <Drawer.Screen
        name="Logout"
        component={AccountScreen} // Or any dummy component
        options={{ drawerLabel: 'Logout' }}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            signOut();  // Call the logout function
          },
        })}
      />
    </Drawer.Navigator>
    
  );
};

export default MainDrawerNavigator;
