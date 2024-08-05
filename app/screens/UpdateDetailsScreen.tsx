import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView, View, Text, TextInput, StyleSheet, Button } from 'react-native';

export default function UpdateDetailsScreen({ navigation }:any) {

  const [displayname, setDisplayName] = useState('');
  const { user, signOut } = useContext(AuthContext);

  const handleUpdate = async () => {
    console.log('update action');
    // await signOut();
    // navigation.replace('Login');
  };

  const handleLogout = async () => {
    await signOut();
    navigation.replace('Login');
  };

  if(user){
    console.log('user', user);
    alert(`${user.email}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
     
        {/* <Text>Update Details</Text>
        <Text>PUT A PICTURE OF A THING HERE</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Settings')}
        />
      </View> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Email"
        value={user?.email}
        onChangeText={setDisplayName}
        autoCapitalize={"none"}
      />
      <Button title="Update" onPress={handleUpdate} />
      <Button title="Logout" onPress={handleLogout} />
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
