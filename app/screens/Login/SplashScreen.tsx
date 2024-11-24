// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Using Redux for state management

const SplashScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user); // Access user state from Redux store
  const loading = useSelector((state) => state.auth.loading); // Access loading state from Redux store

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        if (user) {
          navigation.navigate('Account'); // Navigate to Account if user is authenticated
        } else {
          navigation.navigate('Login'); // Navigate to Login if not authenticated
        }
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [loading, user, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Loading...</Text>
      <ActivityIndicator size="large" color={'white'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white'
  },
});

export default SplashScreen;
