import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import Toast from 'react-native-toast-message';

const UpdateDetailsScreen = ({ navigation }:any) => {
  const { user, signOut } = useContext(AuthContext);
  const [username, setUsername] = useState([]);
  const [website, setWebsite] = useState([]);
  const [full_name, setFullname] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      if (user && user.id) {
        const { data, error } = await supabase.from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          // @ts-ignore
          setError(error.message);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    getUserDetails();

  }, [user]);

  
  const handleUpdate = async () => {

    if (!full_name || !website || !username) {
      // @ts-ignore
      setError('All fields are required');
      return;
    }
    
    // console.log('fullname', fullname); 
    // console.log('website', website); 
    // console.log('username', username); 
    // @ts-ignore
    const updatedProfile = {...profile, username, full_name, website};
    console.log('updated profile', updatedProfile);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: full_name,
        website: website,
        username: username 
      })
      // @ts-ignore
      .eq('id', user.id)
  
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'FUCK',
        text2: 'Something done gone fucked up.' + error.message,
        
      });
      
    } else {
      // console.log('Profile updated successfully:');
      // console.log(updatedProfile);
      setProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'FUCK YEAH! Updated Yo!',
      });
    }
    // @ts-ignore
    setUsername('');

  };


  return (
    <View style={styles.main}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Update Profile Details</Text>
        {user && (
          <>
            <Text>Email: {user.email}</Text>
            <View>
            {/* @ts-ignore */}
            <Text>Full Name: {profile?.full_name}</Text>
             {/* @ts-ignore */}
             {profile?.website ? <Text>Website: {profile?.website}</Text> : null}
             {/* @ts-ignore */}
            <Text>Username: {profile?.username}</Text>
            </View>
          </>
        )}
        <>
          {/* @ts-ignore */}
          <TextInput
            // @ts-ignore
            placeholder={profile?.username}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            value={username}
            // @ts-ignore
            onChangeText={setUsername}
            autoCapitalize={"none"}
            style={styles.inputStyle}
            
          />
          {/* @ts-ignore  */}
          <TextInput
           // @ts-ignore
            placeholder={profile?.website}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            value={website}
            // @ts-ignore
            onChangeText={setWebsite}
            autoCapitalize={"none"}
            style={styles.inputStyle}
            
          />
          {/* @ts-ignore  */}
           <TextInput
           // @ts-ignore
            placeholder={profile?.full_name}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            value={full_name}
            // @ts-ignore
            onChangeText={setFullname}
            autoCapitalize={"none"}
            style={styles.inputStyle}
          
          />
          <Button title="Update" onPress={handleUpdate} />
          <Pressable onPress={() => navigation.navigate('Account', { user })}><Text>Back to profile</Text></Pressable>
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  formContainer:{
    flex: 2,
    marginTop: 10
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  item: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttons: {
    // backgroundColor: 'cornflowerblue',
    display: 'flex',
    flexDirection: 'row',
    margin: 10, 
    alignItems: 'center',
    gap: 4,
    padding: 16
  },
  updateButton: {
    display: 'flex',
    margin: 10, 
    alignSelf: 'center',
    padding: 16
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10
  }
});

export default UpdateDetailsScreen;
