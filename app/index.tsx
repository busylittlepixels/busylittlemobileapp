import React from 'react';
import AppNavigator from './navigation';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;



// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar, StyleSheet } from 'react-native';
// import MainStackNavigator from './navigation/MainStackNavigator';

// const App = () => {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer independent>
//         <StatusBar barStyle="light-content" />
//         <SafeAreaView style={styles.safeArea}>
//           <MainStackNavigator />
//         </SafeAreaView>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
// });

// export default App;
