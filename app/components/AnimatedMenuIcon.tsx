import React, { useState, useContext } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo icons
import { DrawerStatusContext } from '@react-navigation/drawer'; // Importing DrawerStatusContext

const AnimatedMenuIcon = ({ navigation }: any) => {
  const isDrawerOpen = useContext(DrawerStatusContext) === 'open'; // Use DrawerStatusContext to check if drawer is open
  const [isPressed, setIsPressed] = useState(false); // Track if the icon is pressed

  return (
    <Pressable
      onPress={() => {
        // console.log('Menu Pressed');
        navigation.toggleDrawer();
      }}
      onPressIn={() => {
        // console.log('Icon Pressed');
        setIsPressed(true);
      }}  // Set pressed state when pressed
      onPressOut={() => {
        // console.log('Icon Released');
        setIsPressed(false);
      }} // Reset pressed state when released
    >
      <Ionicons
        name={isDrawerOpen ? 'close-outline' : 'menu-outline'} // Toggle based on actual drawer state
        size={30}
        color={isPressed ? 'red' : 'black'} // Change color based on press state
        style={{ marginLeft: 15 }}
      />
    </Pressable>
  );
};

export default AnimatedMenuIcon;
