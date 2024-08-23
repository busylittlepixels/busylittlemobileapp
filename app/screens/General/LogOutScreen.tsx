// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogOutScreen = () => {
  const navigation = useNavigation();

//   useEffect(() => {
//     // Redirect to the login screen or any other screen
//     navigation.navigate('Login'); // Assuming you have a 'Login' screen in your navigator
//   }, [navigation]);

  return (
    <View>
      <Text>Logging Out...</Text>
    </View>
  );
};

export default LogOutScreen;
