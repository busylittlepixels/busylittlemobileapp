// @ts-nocheck
import { useContext } from 'react';
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

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={AccountScreen} />
      <Drawer.Screen name="Profile" component={UpdateDetailsScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
      <Drawer.Screen name="Cities" component={CitiesScreen} />
      <Drawer.Screen
        name="Logout"
        component={AccountScreen} // Or any dummy component
        options={{ drawerLabel: 'Logout' }}
        listeners={({ navigation }) => ({
          drawerItemPress: () => {
            signOut();  // Call the logout function
            navigation.navigate('Login')
          },
        })}
      />
    </Drawer.Navigator>
    
  );
};

export default MainDrawerNavigator;
