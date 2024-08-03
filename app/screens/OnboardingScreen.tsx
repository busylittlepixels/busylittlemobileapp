import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Button } from 'react-native';

export default function OnboardingScreen({ navigation }:any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Onboarding</Text>
        <Text>PUT A PICTURE OF A COCK HERE</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Set a background color to visualize
  },
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
});
