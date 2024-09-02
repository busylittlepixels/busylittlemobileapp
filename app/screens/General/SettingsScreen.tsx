import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = ({ route }:any) => {

  const wtftitle = route.params?.item.title; 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{wtftitle ? wtftitle : 'Screen'}</Text>
      <Text>A smattering of generic text!</Text>
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
  header: {
    fontWeight: 'bold',
    color: 'red'
  }
});

export default SettingsScreen;
