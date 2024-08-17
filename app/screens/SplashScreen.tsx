import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = React.useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          // @ts-ignore
          navigation.navigate('Account');
        } else {
          
        // @ts-ignore
          navigation.navigate('Login');
        }
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
    fontWeight: "black"
  },
});

export default SplashScreen;
