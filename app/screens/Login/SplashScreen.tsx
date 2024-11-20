// @ts-nocheck
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Using Redux for state management
import { selectCurrentUser, selectAuthLoading, useSignInMutation, useSignOutMutation } from "../../services/auth/authApi";

const SplashScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser); // Access user state from Redux store
  const loading = useSelector(selectAuthLoading); // Access loading state from Redux store

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
          navigation.navigate('Account'); // Navigate to Account if user is authenticated
        } else {
          navigation.navigate('Login'); // Navigate to Login if not authenticated
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [loading, user, navigation]);

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
