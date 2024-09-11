import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';
import AccountScreen from '../screens/Account/AccountScreen';
import FavoritesScreen from '../screens/Favourites/FavoritesScreen';
import CitiesScreen from '../screens/Cities/CitiesScreen';
import MySchedule from '../screens/MyScreens/MySchedule';
import UsersScreen from '../screens/General/UsersScreen';
import MyPersonalSchedule from '../screens/MyScreens/MyPersonalSchedule';
import MessagesScreen from '../screens/Chat/MessagesScreen';

const Drawer = createDrawerNavigator();

// Custom Animated Hamburger/X Icon
const AnimatedMenuIcon = ({ navigation }:any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const rotationValue = useRef(new Animated.Value(0)).current;

  // Function to animate the icon
  const toggleIconAnimation = () => {
    Animated.timing(rotationValue, {
      toValue: isDrawerOpen ? 0 : 1, // Animate to 1 if open, 0 if closed
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // Listen to drawer open/close events
    const unsubscribeOpen = navigation.addListener('drawerOpen', () => {
      setIsDrawerOpen(true);
      toggleIconAnimation();
    });

    const unsubscribeClose = navigation.addListener('drawerClose', () => {
      setIsDrawerOpen(false);
      toggleIconAnimation();
    });

    return () => {
      unsubscribeOpen();
      unsubscribeClose();
    };
  }, [isDrawerOpen, navigation]);

  // Rotation interpolation for smooth transition
  const rotateIcon = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // 0deg for hamburger, 45deg for X icon
  });

  return (
    <Pressable onPress={() => navigation.toggleDrawer()}>
      <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
        <Ionicons name={isDrawerOpen ? 'close-outline' : 'menu-outline'} size={30} color="black" style={{ marginLeft: 15 }} />
      </Animated.View>
    </Pressable>
  );
};

// Custom Drawer Content
const CustomDrawerContent = (props:any) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // @ts-ignore
    dispatch(logout());
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
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
const MainDrawerNavigator = () => {
  return (
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
        drawerActiveTintColor: 'red', // Red tint for active drawer items
        drawerActiveBackgroundColor: 'rgba(255, 0, 0, 0.1)', // Light red background when active
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Home" 
        component={AccountScreen} 
        options={{ headerShown: true }} // Keep current header styles intact
      />
      <Drawer.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ headerShown: true }} // Keep current header styles intact
      />
      <Drawer.Screen 
        name="All Users" 
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
  logoutItem: {
    marginTop: 20, // Adds space before the logout item
  },
});

export default MainDrawerNavigator;
