import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Import EventEmitter directly to test if polyfill works
const EventEmitter = require('events');

const PolyfillTest = () => {
  const [message, setMessage] = useState('Testing EventEmitter...');
  
  useEffect(() => {
    try {
      // Create a new EventEmitter instance
      const emitter = new EventEmitter();
      
      // Set up event listener
      emitter.on('test', (data: string) => {
        setMessage(`EventEmitter works! Received: ${data}`);
      });
      
      // Emit an event after a delay
      setTimeout(() => {
        emitter.emit('test', 'Hello from EventEmitter');
      }, 1000);
      
    } catch (error: unknown) {
      // Safely handle the unknown error type
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`Error: ${errorMessage}`);
    }
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default PolyfillTest; 