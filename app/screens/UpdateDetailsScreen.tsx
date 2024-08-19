// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ScrollView, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Spacer from '../components/Spacer';
import { logout } from '../actions/authActions'; // Import the logout action if needed

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

  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [full_name, setFullname] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [data, setData] = useState(null);

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
            <Ionicons name="refresh-outline" size={24} color="lightblue" />
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
          <>
            <Text><Text style={{ fontWeight: 'bold'}}>Email:</Text> {user.email}</Text>
            <View>
              <Text><Text style={{ fontWeight: 'bold'}}>Username:</Text> {profile?.username}</Text>
              <Text><Text style={{ fontWeight: 'bold'}}>Full Name:</Text> {profile?.full_name}</Text>
              {profile?.website ? <Text><Text style={{ fontWeight: 'bold'}}>Website:</Text>  {profile?.website}</Text> : null}
              <Text style={{ fontWeight: 'bold', paddingBottom: 2 }}>Selected city/cities:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedCities.length > 0 ? (
                  <Text>{selectedCities.join(', ')}</Text>
                ) : (
                  <Text>No cities selected</Text>
                )}
              </View>
            </View>
          </>
        )}
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            placeholder={profile?.username}
            placeholderTextColor='#000'
            value={username}
            onChangeText={setUsername}
            autoCapitalize={"none"}
            clearTextOnFocus={true}
            style={styles.inputStyle}
          />
          <Text style={styles.label}>Website:</Text>
          <TextInput
            placeholder={profile?.website}
            placeholderTextColor='#000'
            clearTextOnFocus={true}
            value={website}
            onChangeText={setWebsite}
            autoCapitalize={"none"}
            style={styles.inputStyle}
          />
          <Text style={styles.label}>Full Name:</Text>
          <TextInput
            placeholder={profile?.full_name}
            placeholderTextColor='#000'
            value={full_name}
            clearTextOnFocus={true}
            onChangeText={setFullname}
            autoCapitalize={"none"}
            style={styles.inputStyle}
          />

          <Text style={styles.label}>Manage cities:</Text>
          <View style={styles.inputStyle}>
            {filteredCities.length > 0 ? filteredCities.map((city) => (
              <View key={city} style={styles.selectedCity}>
                <Text>{city}</Text>
                <Button title="Remove" onPress={() => removeCity(city)} />
              </View>
            )): <Text>No cities selected.</Text>}
          </View>
          <Button title="Update" onPress={handleUpdate} />
          <Pressable style={{ paddingVertical: 10, zIndex: 1 }}  onPress={() => navigation.replace('Account', { user })}>
            <Text>Back to profile</Text>
          </Pressable>
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
    marginTop: 20,
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
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 5,
    fontSize: 18,
  },
});

export default UpdateDetailsScreen;
