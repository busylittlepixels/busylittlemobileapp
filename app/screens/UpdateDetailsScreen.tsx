// @ts-nocheck
import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import Toast from 'react-native-toast-message';

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  website?: string;
}

export interface User {
  id: string;
}

interface UpdateProfileFormProps {
  navigation: any;
  profile: Profile;
  user: User;
}

const UpdateDetailsScreen = ({ navigation }:UpdateProfileFormProps) => {
  const { user, signOut } = useContext(AuthContext);
  const [username, setUsername] = useState([]);
  const [website, setWebsite] = useState([]);
  const [full_name, setFullname] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>([]);
  const [profile, setProfile] = useState([]);

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

  useEffect(() => {
    setUsername(profile?.username || '');
    setFullname(profile.full_name || '');
    setWebsite(profile.website || '');
  }, [profile]);

  const handleUpdate = async () => {
    const updates: Partial<Profile> = {};

    if (username && username !== profile.username) {
      updates.username = username;
    }

    if (full_name && full_name !== profile.full_name) {
      updates.full_name = full_name;
    }

    if (website && website !== profile.website) {
      updates.website = website;
    }

    if (Object.keys(updates).length === 0) {
      setError('At least one field must be updated');
      return;
    }

    const updatedProfile: Profile = { ...profile, ...updates };
    console.log('updated profile', updatedProfile);

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong: ' + error.message,
      });
    } else {
      setProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
      });
    }
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
        <View style={styles.formContainer}>
          {/* @ts-ignore */}
          <Text style={styles.label}>Username:</Text>
          <TextInput
            // @ts-ignore
            placeholder={profile?.username}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            value={username}
            // @ts-ignore
            onChangeText={setUsername}
            autoCapitalize={"none"}
            clearTextOnFocus={true}
            style={styles.inputStyle}
            
          />
          <View></View>
          <Text style={styles.label}>Website:</Text>
          <TextInput
           // @ts-ignore
            placeholder={profile?.website}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            clearTextOnFocus={true}
            value={website}
            // @ts-ignore
            onChangeText={setWebsite}
            autoCapitalize={"none"}
            style={styles.inputStyle}
            
          />
          <Text style={styles.label}>Full Name:</Text>
          {/* @ts-ignore  */}
           <TextInput
           // @ts-ignore
            placeholder={profile?.full_name}
            placeholderTextColor='#000'
            placeholderPadding="5px"
            value={full_name}
            clearTextOnFocus={true}
            // @ts-ignore
            onChangeText={setFullname}
            autoCapitalize={"none"}
            style={styles.inputStyle}
          
          />
          <Button title="Update" onPress={handleUpdate} />
          <Pressable onPress={() => navigation.navigate('Account', { user })}><Text>Back to profile</Text></Pressable>
        </View>
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
  label:{
    paddingTop: 10,
    fontWeight: 'bold'
  },
  formContainer:{
    flex: 3,
    marginTop: 20
  },
  innerContainer: {
    flex: 1, 
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
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10
  }
});

export default UpdateDetailsScreen;
