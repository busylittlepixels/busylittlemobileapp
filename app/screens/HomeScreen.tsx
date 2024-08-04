import React from 'react';
import { View, Image, Text, StyleSheet, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const HomeScreen =  ({ route, navigation }:any) => {

  const { email } = route.params ? route.params : { email: 'test@cock.cc' };
 
  const navigateToProfile = () => {
    navigation.navigate('Account', { email })
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, {email ? email : 'Test'}!</Text>
      <Button title="To my Account!" onPress={navigateToProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  reactLogo: {
    height: 50,
    width: 50,
    bottom: 0,
    left: 0
  }
});

export default HomeScreen;
