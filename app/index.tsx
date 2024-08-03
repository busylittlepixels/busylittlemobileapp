import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import MainStackNavigator from './navigation/MainStackNavigator';

const App = () => {
  return (
    <>
      <NavigationContainer independent={true}>
        <MainStackNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;
