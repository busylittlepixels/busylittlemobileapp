// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ScrollView, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable, RefreshControl, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Spacer from '../components/Spacer';
import { logout, setAdvertPreference } from '../actions/authActions'; // Import the logout action if needed

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

const UpdateDetailsScreen = ({ navigation }: UpdateProfileFormProps) => {
  const dispatch = useDispatch();

  // Access Redux state
  const user = useSelector((state) => state.auth.user);
  const showAdverts = useSelector((state) => state.auth.showAdverts);
  
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [full_name, setFullname] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [data, setData] = useState(null);

  const toggleAdverts = (value) => {
    dispatch(setAdvertPreference(value));
  };

  const UpdateButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#90EE90' : 'green', // Dim the color when pressed
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    );
  };

  const ProfileButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'lightgray' : 'gray', // Dim the color when pressed
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    );
  };

  const triggerRefresh = async () => {
    try {
      await loadDataFromStorage();
      Toast.show({
        type: 'success',
        text1: 'Data synced successfully',
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sync data. Please try again.',
      });
    }
  };

  const loadDataFromStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (keys.length > 0) {
        const result = await AsyncStorage.multiGet(keys);
        const storedData = result.map(([key, value]) => ({ [key]: value }));
        
        // If you expect JSON values, you might need to parse them individually
        const parsedData = storedData.map(item => {
          const key = Object.keys(item)[0];
          try {
            return { [key]: JSON.parse(item[key]) };
          } catch (e) {
            // Handle case where data isn't JSON
            return { [key]: item[key] };
          }
        });
        setData(parsedData);
      } else {
        console.log('No data found in storage');
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage', error);
    }
  };

  // Setting the header right icon to trigger loadDataFromStorage
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
          <Pressable onPress={triggerRefresh}>
            <Ionicons name="refresh-outline" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const getUserDetails = async () => {
      if (user && user.id) {
        const { data, error, status } = await supabase.from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && status !== 406) {
          console.log(error);
          setError(error.message);
          throw error;
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
    setFullname(profile?.full_name || '');
    setWebsite(profile?.website || '');
    setSelectedCities(profile?.cities || []);
  }, [profile]);

  const handleUpdate = async () => {
    const updates: Partial<Profile> = {};

    if (username && username !== profile?.username) {
      updates.username = username;
    }

    if (full_name && full_name !== profile?.full_name) {
      updates.full_name = full_name;
    }

    if (website && website !== profile?.website) {
      updates.website = website;
    }

    if (selectedCities && selectedCities !== profile?.cities) {
      updates.cities = selectedCities;
    }

    if (Object.keys(updates).length === 0) {
      setError('At least one field must be updated');
      return;
    }

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
      setProfile({ ...profile, ...updates });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
      });
    }
  };

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Sync data from AsyncStorage
    loadDataFromStorage().then(() => setRefreshing(false));
    
    setTimeout(() => {
        setRefreshing(false);
        console.log('should refresh user details');
    }, 2000);
  }, []);

  const filteredCities = selectedCities && selectedCities.filter(city => city.toLowerCase());

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Update Profile Details</Text>
        <Spacer space={20} />
        {user && (
          <View style={styles.profileHeader}>
            <Text><Text style={{ fontWeight: 'bold'}}>Email:</Text> {user.email}</Text>
            <View>
              <Text><Text style={{ fontWeight: 'bold'}}>Username:</Text> {profile?.username}</Text>
              {profile?.website ? <Text><Text style={{ fontWeight: 'bold'}}>Website:</Text>  {profile?.website}</Text> : null}
              <Text style={{ fontWeight: 'bold', paddingBottom: 2 }}>Selected cities:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedCities.length > 0 ? (
                  <Text>{selectedCities.join(', ')}</Text>
                ) : (
                  <Text>No cities selected</Text>
                )}
              </View>
              <Text><Text style={{ fontWeight: 'bold'}}>Show adverts: </Text> {showAdverts ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inlineLabel}>Username:</Text>
            <TextInput
              placeholder={profile?.username}
              placeholderTextColor='#000'
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              clearTextOnFocus={true}
              style={styles.innerWrapperInputStyle}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inlineLabel}>Website:</Text>
            <TextInput
              placeholder={profile?.website}
              placeholderTextColor='#000'
              clearTextOnFocus={true}
              value={website}
              onChangeText={setWebsite}
              autoCapitalize={"none"}
              style={styles.innerWrapperInputStyle}
            />
          </View>

         
          <View style={styles.inputWrapper}>
            <Text style={styles.inlineLabel}>Full Name:</Text>
            <TextInput
              placeholder={profile?.full_name}
              placeholderTextColor='#000'
              clearTextOnFocus={true}
              value={full_name}
              clearTextOnFocus={true}
              onChangeText={setFullname}
              autoCapitalize={"none"}
              style={styles.innerWrapperInputStyle}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inlineLabel}>Show Adverts</Text>
            <View style={styles.innerWrapper}>
              <Switch
                value={showAdverts}
                trackColor={{ true: 'green', false: 'gray' }}
                onValueChange={toggleAdverts}
                style={styles.innerWrapperInputStyle}
              />
            </View>
          </View>
    

          <Text style={styles.label}>Manage cities:</Text>
          <View style={styles.inputStyle}>
            {filteredCities.length > 0 ? filteredCities.map((city) => (
              <View key={city} style={styles.selectedCity}>
                <Text>{city}</Text>
                <Button title="Remove" onPress={() => removeCity(city)} />
              </View>
            )): <Text>No cities selected.</Text>}
          </View>
          <UpdateButton title="Update" onPress={handleUpdate} />
          <ProfileButton title="Back to Profile" onPress={() => navigation.replace('Account', { user })} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  label: {
    paddingTop: 10,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 3,
    // marginTop: 10,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10,
    borderRadius: 3,
  },
  selectedCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 5,
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader:{
    paddingVertical: 20,
    paddingHorizontal: 15, 
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 3, 
    marginBottom: 5
  },
  inputWrapper: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    justifyContent: 'space-between'
  },
  
  inlineLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 10, // Space between label and input
  },
  innerWrapperInputStyle: {
    flex: 1, // Take up the remaining space
    textAlign: 'right', // Align text to the right
    color: '#000',
    fontSize: 14,
  },
  
});

export default UpdateDetailsScreen;
