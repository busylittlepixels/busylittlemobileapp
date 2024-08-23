// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Using Redux for state management

const SplashScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user); // Access user state from Redux store
  const loading = useSelector((state) => state.auth.loading); // Access loading state from Redux store

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (user) {
  //       if (user) {
  //         navigation.navigate('Account'); // Navigate to Account if user is authenticated
  //       } else {
  //         navigation.navigate('Login'); // Navigate to Login if not authenticated
  //       }
  //     }
  //   }, 2000); // 2 seconds delay

  //   return () => clearTimeout(timer);
  // }, [loading, user, navigation]);


  useEffect(() => {
    if (loading) {
      console.log('loading');

      return; // Do nothing if loading is true
    }
  
    if (user && user.id) {
      console.log('splash user', user); 
      console.log('splash id', user?.id)
      // Only navigate if user and user.id are defined
      navigation.reset({
        index: 0,
        routes: [{ name: 'Account' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }


  }, [loading, user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
