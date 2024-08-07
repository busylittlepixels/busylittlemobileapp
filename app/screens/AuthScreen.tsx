import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: Props) => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      navigation.navigate('Account');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.logoTitle}>busylittlemobileapp.</Text>
      <Text style={styles.loginTitle}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize={"none"}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        autoCapitalize={"none"}
      />
      <Button title="Login" onPress={handleLogin} />

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

export default LoginScreen;
