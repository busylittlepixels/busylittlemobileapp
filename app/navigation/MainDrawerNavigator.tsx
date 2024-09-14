import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabase'; // Update the path as necessary
import { logout } from '../actions/authActions';
import AccountScreen from '../screens/Account/AccountScreen';
import FavoritesScreen from '../screens/Favourites/FavoritesScreen';
import CitiesScreen from '../screens/Cities/CitiesScreen';
import MySchedule from '../screens/MyScreens/MySchedule';
import UsersScreen from '../screens/General/UsersScreen';
import MyPersonalSchedule from '../screens/MyScreens/MyPersonalSchedule';
// import MessagesScreen from '../screens/Chat/MessagesScreen';
import AnimatedMenuIcon from '../components/AnimatedMenuIcon'

const Drawer = createDrawerNavigator();

function MessagesPlaceholder() {
  return null;
}

// Custom Drawer Content
const CustomDrawerContent = (props:any) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // @ts-ignore
    dispatch(logout());
  };

  const doNothing = () => {
    return
  }

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <DrawerItem
        label="BUSYLITTLEPIXELS"
        labelStyle={styles.drawerLabelLogo}
        onPress={doNothing}
        style={styles.logoutItem}
      />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={styles.drawerLabel}
        onPress={handleLogout}
        style={styles.logoutItem}
      />
    </DrawerContentScrollView>
  );
};

// Main Drawer Navigator
const MainDrawerNavigator = ({ navigation, route }:any) => {
  // @ts-ignore
  const user = useSelector((state) => state.auth.user); // Get user info from Redux
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // Unread message count
  const [loading, setLoading] = useState(true); // Loading state
  const { handleSendPushNotification } = route.params || {};
  
  console.log('MainDrawerNavigator push functions:', handleSendPushNotification )

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
      initialRouteName="Home"
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
        initialParams={{ handleSendPushNotification }}
        component={AccountScreen} 
        options={{ headerShown: true }} // Keep current header styles intact
      />
      <Drawer.Screen 
        name="Messages" 
        component={MessagesPlaceholder}
        options={{ 
          headerShown: true,
          drawerLabel: !loading && unreadMessagesCount > 0 ? `Messages (${unreadMessagesCount})` : 'Messages',
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
        initialParams={{ handleSendPushNotification }}
        component={UsersScreen} 
        options={{ drawerLabel: 'All Users', headerShown: true }} // Header stays the same
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ headerShown: true }} // Header stays the same
      />
      <Drawer.Screen 
        name="Cities" 
        component={CitiesScreen} 
        options={{ headerShown: true }} // Header stays the same
      />
      <Drawer.Screen 
        name="Personal Schedule" 
        component={MyPersonalSchedule} 
        options={{ drawerLabel: 'Schedule', headerShown: true }} // Header stays the same
      />
      <Drawer.Screen 
        name="My Schedule" 
        component={MySchedule} 
        options={{ drawerLabel: 'Events', headerShown: true }} // Header stays the same
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#000', // Black background for the drawer
    flex: 1,
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
    marginTop: 20, // Adds space before the logout item
  },
});

export default MainDrawerNavigator;
