// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { login } from '../actions/authActions'; // Import the Redux login action
import { useSelector } from 'react-redux';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const AuthScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: { auth: { user: any; }; }) => state.auth.user); // Monitor user state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigation.navigate('Account'); // Navigate only when user is available
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      console.log('logging in');
      await dispatch(login(email, password));
    } catch (error) {
      console.error(error);
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
