import React from 'react';
import { View, Image, Text, StyleSheet, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useRoute } from '@react-navigation/native';

const HomeScreen =  ({ navigation }:any) => {
  const route = useRoute(); 
  console.log('route', route.params)
  console.log('navigation', navigation)
  // @ts-ignore
  const email = route.params?.email && route.params.email; 
  const navigateToProfile = () => {
    // @ts-ignore
    navigation.navigate('Account', { email })
  };

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <Text>Boooosh! Home screen for { route?.params?.email ? route.params.email : "Guest"}</Text>
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
