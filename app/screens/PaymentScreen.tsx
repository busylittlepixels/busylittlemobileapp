import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
// @ts-ignore
const PaymentScreen = ({ navigation }: Props) => {
  const { user, signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    navigation.replace('Login');
  };

  if(user){
    console.log('user', user);
    // alert(`${user.email}`);
  }
  return (
    <View style={styles.container}>
      <Text>Payment Screen - ass</Text>
      {user && <Text>Payment Screen for user: {user?.email}</Text>}
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

export default PaymentScreen;
