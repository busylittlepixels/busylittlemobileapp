import React, { useState, useEffect, useRef } from 'react';
import { Asset } from 'expo-asset';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabase'; // Update the path as necessary
// import { logout } from '../actions/authActions';
import { selectCurrentUser, useSignOutMutation } from "../services/auth/authApi";
import AccountScreen from '../screens/Account/AccountScreen';
import FavoritesScreen from '../screens/Favourites/FavoritesScreen';
import CitiesScreen from '../screens/Cities/CitiesScreen';
import MySavedEvents from '../screens/MyScreens/MySavedEvents';
import UsersScreen from '../screens/General/UsersScreen';
import MyPersonalSchedule from '../screens/MyScreens/MyPersonalSchedule';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedMenuIcon from '../components/AnimatedMenuIcon'

const Drawer = createDrawerNavigator();

function MessagesPlaceholder() {
  return null;
}



// Custom Drawer Content
const CustomDrawerContent = (props:any) => {

  
  const profile_img = Asset.fromModule(require('./../assets/images/blp-splash.png')).uri;
  console.log(profile_img);

  const dispatch = useDispatch();
  const logout = useSignOutMutation(); 
  const handleLogout = () => {
    // @ts-ignore
    dispatch(logout);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
       <Image
        source={{ uri: profile_img }}
        style={styles.sideMenuProfileIcon}
      />
      <DrawerContentScrollView {...props} style={styles.drawerContainer}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          labelStyle={styles.drawerLabel}
          onPress={handleLogout}
          style={styles.logoutItem}
          icon={() => (
            <Ionicons name="log-out-outline" size={24} color="white" />
          )}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

// Main Drawer Navigator
const MainDrawerNavigator = ({ navigation, route }:any) => {
  // @ts-ignore
  const user = useSelector(selectCurrentUser); // Get user info from Redux
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // Unread message count
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch unread messages from the database
  const fetchUnreadMessagesCount = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', user?.id) // Use the logged-in user's ID
      .eq('read', false); // Only fetch unread messages
    
    if (error) {
      console.error('Error fetching unread messages:', error);
    } else {
      setUnreadMessagesCount(data.length); // Set unread count
    }
    setLoading(false); // Mark as not loading anymore
  };

  useEffect(() => {
    fetchUnreadMessagesCount(); // Fetch unread messages on mount

    const intervalId = setInterval(fetchUnreadMessagesCount, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    // @ts-ignore
    <Drawer.Navigator
      initialRouteName="Account"
      screenOptions={({ navigation }) => ({
        headerTintColor: '#000', // Color for header text and icons
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
        headerLeft: () => <AnimatedMenuIcon navigation={navigation} />, // Use animated icon
        drawerStyle: {
          backgroundColor: '#000', // Black background for the drawer
        },
        drawerLabelStyle: {
          color: '#fff', // White text for drawer labels
          fontSize: 14, // Larger font size for drawer labels
          fontWeight: 'bold',
        },
        drawerActiveTintColor: 'white', // Red tint for active drawer items
        drawerActiveBackgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background when active
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Home" 
        component={AccountScreen} 
        options={{ headerShown: true, 
          drawerIcon: () => (
            <Ionicons name="home-outline" size={24} color="white" />
          )
        }} // Keep current header styles intact
      />
      <Drawer.Screen 
        name="Messages" 
        component={MessagesPlaceholder}
        options={{ 
          headerShown: true,
          drawerLabel: !loading && unreadMessagesCount > 0 ? `Messages (${unreadMessagesCount})` : 'Messages',
          drawerIcon: () => (
            <Ionicons name="chatbubbles-outline" size={24} color="white" />
          )
        }}
        listeners={{
          drawerItemPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the MessagesScreen in the Profile's Tab Navigator
            navigation.navigate('Profile', {
              screen: 'Messages'
            });
          }
        }}
      />
      <Drawer.Screen 
        name="All Users" 
        component={UsersScreen} 
        options={{ drawerLabel: 'All Users', headerShown: true, 
          drawerIcon: () => (
            <Ionicons name="people-outline" size={24} color="white" />
            )
         }} 
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ headerShown: true, 
          drawerIcon: () => (
            <Ionicons name="heart-outline" size={24} color="white" />
            )
         }} 
      />
      <Drawer.Screen 
        name="Cities" 
        component={CitiesScreen} 
        options={{ headerShown: true,
          drawerIcon: () => (
            <Ionicons name="pin-outline" size={24} color="white" />
            )
        }} 
      />
      <Drawer.Screen 
        name="Personal Schedule" 
        component={MyPersonalSchedule} 
        options={{ drawerLabel: 'Schedule', headerShown: true, 
          drawerIcon: () => (
            <Ionicons name="calendar-outline" size={24} color="white" />
            )
        }} 
      />
      <Drawer.Screen 
        name="Saved Events" 
        component={MySavedEvents} 
        options={{ drawerLabel: 'Events', headerShown: true, 
          drawerIcon: () => (
            <Ionicons name="ticket-outline" size={24} color="white" />
          )
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#000', // Black background for the drawer
    flex: 1,
    // justifyContent: 'space-between' 
  },
  drawerLabel: {
    color: '#fff', // White text for drawer items
    fontSize: 14, // Larger font size
  },
  drawerLabelLogo: {
    color: '#fff', // White text for drawer items
    fontSize: 18, // Larger font size
  },
  logoutItem: {
    borderTopWidth: 1,
    borderColor: 'white',
    marginTop: 100, // Adds space before the logout item
    width: '80%',
    paddingTop: 10,
    borderRadius: 0
  },
  sideMenuProfileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,  // Make it circular
    alignSelf: 'center',
    borderColor: 'white',   // Set border color to white
    borderWidth: 2,          // Set the width of the border (you can adjust the value)
    marginVertical: 50,
    // marginLeft: 15
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
});

export default MainDrawerNavigator;
