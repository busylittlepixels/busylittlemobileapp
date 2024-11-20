// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { selectCurrentUser, useSignInMutation, selectAuthLoading } from '../../services/auth/authApi'; // Import the Redux login action
import { useSelector } from 'react-redux';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const AuthScreen = ({ navigation }: Props) => {
  // const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser); // Monitor user state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [triggerLogin, { isLoading }] = useSignInMutation();

  useEffect(() => {
    if (user) {
      navigation.navigate('Account'); // Navigate only when user is available
    }
  }, [user]);

  const handleLogin = async () => {
    console.log('SOMETHING!!!!')
    setError(null); // Clear previous errors
    selectAuthLoading(true);
    try {
      // Trigger login mutation
      const result = await triggerLogin({ email, password }).unwrap();
  
      // Check if login was successful
      if (!result?.user) {
        setError('Invalid email or password. Please try again.');
      } else {
        console.log('Login successful:', result);
      }
    } catch (err: any) {
      // Handle specific errors returned by Supabase
      if (err?.data?.includes("Invalid login credentials")) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login error:', err);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.logoTitle}>busylittlemobileapp.</Text>
      <Text style={styles.loginTitle}>Sign In</Text>
      <TextInput
        placeholder="your@email.com"
        placeholderTextColor='#000'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize={"none"}
        clearTextOnFocus={true}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor='#000'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize={"none"}
        clearTextOnFocus={true}
      />
      <Button title={isLoading ? 'Logging In...' : 'Login'} onPress={handleLogin} />
      <Pressable onPress={() => navigation.navigate('SignUp')}>
        <Text>No account? Sign Up</Text>
      </Pressable>
      <View>{''}</View>
      <Pressable onPress={() => navigation.navigate('ResetPass')}>
        <Text>Forgot Password?</Text>
      </Pressable>
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
    borderRadius: 3, 
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    padding: 10,
    color: '#000',
  },
});

export default AuthScreen;
