import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AccountHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Account Home</Text>
        <Text style={styles.subtitle}>Welcome to your account</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/screens/Cities')}
          >
            <Text style={styles.buttonText}>Cities</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/screens/Profile')}
          >
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/screens/Events')}
          >
            <Text style={styles.buttonText}>Events</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 