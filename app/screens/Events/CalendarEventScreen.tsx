import React, { useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

const CalendarEventScreen = ({ navigation, route }:any) => {

  const wtftitle = route.params?.item.title; 
  const detail = route.params?.item.detail

  console.log('Calendar Event', route.params)

  useEffect(() => {
    navigation.setOptions({ title: wtftitle });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{wtftitle ? wtftitle : 'Screen'}</Text>
      <Text>{detail ? detail : 'TBC'}</Text>
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

export default CalendarEventScreen;
