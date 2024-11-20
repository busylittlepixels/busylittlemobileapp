// @ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, useSignInMutation, useSignOutMutation } from "../../services/auth/authApi";
import { setCredentials } from '../../services/auth/authSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { current } from '@reduxjs/toolkit';
// import { login } from '../../actions/authActions';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginButton = ({ title, onPress }) => {
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

const LoginScreen = ({ navigation }: Props) => {
  
  const user = useSelector(selectCurrentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [triggerLogin, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await triggerLogin({ email, password }).unwrap();
  
      // Log the result to verify the user and session data
      console.log('Login Result:', result);
  
      if (result?.user && result?.session?.access_token) {
        // Dispatch to set user in Redux
        dispatch(setCredentials({ user: result.user, token: result.session.access_token }));
  
        // Navigate to the authenticated screen
        navigation.replace('Account');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginString}>
        <Text style={styles.logoTitle}>busy</Text><Text style={styles.logoTitleHighlight}>little</Text><Text style={styles.logoTitle}>loginpage</Text>
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="your@email.com"
        placeholderTextColor='#fff'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        clearTextOnFocus={true}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor='#fff'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        clearTextOnFocus={true}
      />
      <LoginButton title={isLoading ? "Logging In..." : "Login"} onPress={handleLogin} />
      <View style={styles.dropLinks}>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.otherLinks}>No account? Sign Up</Text>
        </Pressable>
        <View>{''}</View>
        <Pressable onPress={() => navigation.navigate('ResetPass')}>
          <Text style={styles.otherLinks}>Forgot Password?</Text>
        </Pressable>
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

export default LoginScreen;
