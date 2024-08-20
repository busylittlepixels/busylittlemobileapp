import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { signUp } from '../actions/authActions'; // Import the correct signUp action

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpButton = ({ title, onPress }:any) => {
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

const SignUpScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch(); // Hook to dispatch actions
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
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || !full_name || !username) {
      setError('All fields are required');
      return;
    }
    setError(null);
    try {
      // @ts-ignore
      await dispatch(signUp(email, password, full_name, username)); // Dispatch the signUp action
      Alert.alert('Success', 'Please check your email to confirm your account.');
      navigation.navigate('Auth');
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginString}>
        <Text style={styles.logoTitle}>busy</Text><Text style={styles.logoTitleHighlight}>little</Text><Text style={styles.logoTitle}>signuppage</Text>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Username</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor='#fff'
        value={username}
        onChangeText={setUserName}
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      <Text>Full Name</Text>
      <TextInput
        placeholder="Full Name"
        placeholderTextColor='#fff'
        value={full_name}
        onChangeText={setFullName}
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      
      <Text>Email</Text>
      <TextInput
        placeholder="you@example.com"
        placeholderTextColor='#fff'
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
        placeholderTextColor='#fff'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize='none'
        clearTextOnFocus={true}
      />
      <SignUpButton title="Sign Up" onPress={handleSignUp} />
      <View style={styles.dropLinks}>
        <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.otherLinks}>Have an account? Log In</Text></Pressable>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     padding: 10,
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//   },
//   logoTitle: {
//     fontSize: 20,
//     fontWeight: 700,
//     textAlign: 'center',
//     padding: 10,
//     color: '#000'
//   }
// });

export default SignUpScreen;
