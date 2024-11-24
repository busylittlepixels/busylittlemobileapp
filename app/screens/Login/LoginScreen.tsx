// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, restoreUser } from '../../actions/authActions';
import { has } from 'ramda';

const LoginButton = ({ title, onPress }) => (
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

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Redux user state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Restore user from AsyncStorage

  useEffect(() => {
      const checkUser = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          const hasLaunched = await AsyncStorage.getItem('hasLaunched');
          console.log('previously onboarded', hasLaunched);
          if (user) {
            dispatch(restoreUser()); // Dispatch the restoreUser action
            navigation.navigate('Account'); // Navigate to Account screen
          }
        } catch (error) {
          console.error('Error checking user:', error);
        }
      };
    
      checkUser();
    }, [dispatch, navigation]);

  const handleLogin = async () => {
    try {
      const loggedInUser = await dispatch(login(email, password)); // Dispatch login action
      if (loggedInUser) {
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser)); // Persist user in AsyncStorage
        navigation.navigate('Account'); // Navigate to Account screen
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginString}>
        <Text style={styles.logoTitle}>busy</Text>
        <Text style={styles.logoTitleHighlight}>little</Text>
        <Text style={styles.logoTitle}>loginpage</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        placeholder="your@email.com"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        clearTextOnFocus
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        clearTextOnFocus
      />
      <LoginButton title="Login" onPress={handleLogin} />
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
    color: 'white',
  },
  loginString: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 3,
    color: 'white',
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
  },
  logoTitleHighlight: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  otherLinks: {
    color: 'white',
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
  dropLinks: {
    marginTop: 50,
    paddingVertical: 20,
  },
});

export default LoginScreen;
