import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { authService } from '../../services/authService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';

type ResetPassScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: ResetPassScreenNavigationProp;
}

const ResetPassScreen = ({ navigation }: Props) => {
  const resetPassword = authService.resetPassword;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordReset = async () => {
    try {
      await resetPassword(email);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
    
        <Text style={styles.logoTitle}>busylittlemobileapp.</Text>
        <Text style={styles.loginTitle}>Reset Your Password</Text>
      
        
        <TextInput
            placeholder="your@email.com"
            placeholderTextColor='#000'
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize={"none"}
            clearTextOnFocus={true}
        />
     
        <Button title="Reset Password" onPress={handlePasswordReset} />
        <Pressable onPress={() => navigation.navigate('Login')}><Text>Back to Login</Text></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    padding: 10
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    padding: 10,
    color: '#000'
  }
});

export default ResetPassScreen;
