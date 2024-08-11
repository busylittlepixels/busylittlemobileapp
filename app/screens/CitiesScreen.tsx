import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';

const CityListScreen = ({ navigation, route }:any) => {
  // console.log('city params', route.params);

  useEffect(() => {
    navigation.setOptions({ title: 'My Cities' });
    }, [navigation]);

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cities</Text>
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
  },
});

export default CityListScreen;
