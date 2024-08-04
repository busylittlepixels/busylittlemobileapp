import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Button, Text, StyleSheet } from 'react-native';




const LoginScreen = ({ navigation }:any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    // Handle login logic
    // alert(`Logging in with username: ${email}`);
    navigation.navigate('Home', { email });
  };

  const signup = () => {
    // Handle sign-up logic
    navigation.replace('SignUp');
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity><Button title="Login" onPress={login} /></TouchableOpacity>
      
      <Text>Or</Text>
      <Button title="SignUp" onPress={signup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
