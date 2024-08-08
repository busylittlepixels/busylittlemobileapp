import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Pressable } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen = ({ navigation }: Props) => {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [full_name, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignUp = async () => {

    console.log(email, username, full_name, password)
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || !full_name || !username ) {
      setError('All fields are required');
      return;
    }
    setError(null);
    try {
      // @ts-ignore
      await signUp(email, password, full_name, username);
      Alert.alert('Success', 'Please check your email to confirm your account.');
      navigation.navigate('Auth');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoTitle}>busylittlemobileapp.</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Username</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor='#000'
        value={username}
        onChangeText={setUserName}
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      <Text>FullName</Text>
      <TextInput
        placeholder="Full Name"
        placeholderTextColor='#000'
        value={full_name}
        onChangeText={setFullName}
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      
      <Text>Email</Text>
      <TextInput
        placeholder="you@example.com"
        placeholderTextColor='#000'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="Password"
        placeholderTextColor='#000'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Pressable onPress={() => navigation.navigate('Login')}><Text>Have an account? Log In</Text></Pressable>
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    padding: 10,
    color: '#000'
  }
});

export default SignUpScreen;
