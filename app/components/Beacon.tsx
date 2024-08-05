import React from 'react';
import { View, Text, Button } from 'react-native';
import { authService } from '../services/authService';

const Beacon = () => {
  const handleSomeAuthAction = async () => {
    try {
      const user = await authService.signIn('roleary81@gmail.com', '@R0n@n1981');
      console.log('Signed in user:', user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>BING BING</Text>
      <Button title="Perform Auth Action" onPress={handleSomeAuthAction} />
    </View>
  );
};

export default Beacon;
