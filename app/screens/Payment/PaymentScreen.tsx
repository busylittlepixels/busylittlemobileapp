// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions'; // Import the correct logout action

const PaymentScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch(); // Hook to dispatch actions

  // Access the user from Redux state
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout()); // Dispatch the logout action
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text>Payment Screen</Text>
      {user && <Text>Payment Screen for user: {user?.email}</Text>}
      <Button title="Logout" onPress={handleLogout} />
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
