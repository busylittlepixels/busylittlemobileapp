// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { login } from '../actions/authActions';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await dispatch(login(email, password));
      if (!user) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoTitle}>busylittlemobileapp.</Text>
      <Text style={styles.loginTitle}>Sign In</Text>
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
      <Button title="Login" onPress={handleLogin} />
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
    backgroundColor: '#000',
    color: 'white'
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
    padding: 10,
    color: 'white'
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    padding: 10,
    color: '#000',
    color: 'white'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
