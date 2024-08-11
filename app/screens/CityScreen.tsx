import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';

const CityScreen = ({ navigation, route }:any) => {
  // console.log('city params', route.params);

  useEffect(() => {
    navigation.setOptions({ title: route.params?.city });
}, [navigation]);

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.params.city}</Text>
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

export default CityScreen;
