import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IndexScreen = ({ route }:any) => {
  const { email } = route.params ? route.params : 'test@cock.cc';

  return (
    <View style={styles.container}>
      <Text>Welcome, {email ? email : 'Cunt'}!</Text>
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
});

export default IndexScreen;
