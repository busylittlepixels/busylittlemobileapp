// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions'; // Import the correct logout action
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';

const PaymentScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const { confirmPayment, loading } = useConfirmPayment();

  // Access the user from Redux state
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logout()); // Dispatch the logout action
    navigation.replace('Login');
  };

  const handlePayPress = async () => {
    // call your backend to create a payment intent
    const clientSecret = await createPaymentIntent();

    const { paymentIntent, error } = await confirmPayment(clientSecret, {
      type: 'Card',
    });

    if (error) {
      console.log('Payment confirmation error', error);
    } else if (paymentIntent) {
      console.log('Payment successful', paymentIntent);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Payment Screen</Text>
      {user && <Text>Payment Screen for user: {user?.email}</Text>}
      <CardField
        postalCodeEnabled={true}
        onCardChange={(cardDetails) => {
          console.log('cock details', cardDetails);
        }}
        style={{ width: '100%', height: 50 }}
      />
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
