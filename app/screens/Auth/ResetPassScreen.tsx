import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { authService } from '../../services/authService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';

type ResetPassScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: ResetPassScreenNavigationProp;
}

const ResetPassButton = ({ title, onPress }:any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#cc0000' : '#FF0000', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

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
      <View style={styles.loginString}>
        <Text style={styles.logoTitle}>busy</Text><Text style={styles.logoTitleHighlight}>little</Text><Text style={styles.logoTitle}>passwordresetpage</Text>
      </View>
    
        <Text style={styles.loginTitle}>Reset Your Password</Text>
      
        <Text>Password</Text>
        <TextInput
          placeholder="New Password"
          placeholderTextColor='#fff'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize='none'
          clearTextOnFocus={true}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor='#fff'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize='none'
          clearTextOnFocus={true}
        />
     
        <ResetPassButton title="Reset Password" onPress={handlePasswordReset} />
        <View style={styles.dropLinks}>
          <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.otherLinks}>Did you memba? Log In</Text></Pressable>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000',
    color: 'white'
  },
  loginString:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 3, 
    color: 'white'
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white'
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white'
  },
  logoTitleHighlight: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: 'red'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  otherLinks:{
    color: 'white'
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropLinks:{
    marginTop: 50,
    paddingVertical: 20
  }
});

export default ResetPassScreen;