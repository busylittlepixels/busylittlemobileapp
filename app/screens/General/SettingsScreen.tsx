import React, { useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = ({ route }:any) => {
  const navigation = useNavigation();
  const wtftitle = route.params?.item.title; 

  useEffect(() => {
    navigation.setOptions({ title: wtftitle });
  }, [navigation]);

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
