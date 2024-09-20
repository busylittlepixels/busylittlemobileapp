// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ActivityIndicator, Alert, ScrollView, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable, Progress, RefreshControl, Switch, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { supabase } from '../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Spacer from '../../components/Spacer';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { decode } from 'base64-arraybuffer'; // Import decode from base64-arraybuffer
import { logout, setAdvertPreference } from '../../actions/authActions'; // Import the logout action if needed
import ImageUploader from '../../components/ImageUploader';

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  website?: string;
  avatar_url?: string; // Added avatar_url for image upload
}

export interface User {
  id: string;
}

interface UpdateProfileFormProps {
  navigation: any;
  profile: Profile;
  user: User;
}

const UpdateDetailsScreen = forwardRef(({ navigation }, ref) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Access Redux state

  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [full_name, setFullname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Added state for avatar URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>([]);
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
    // console.log('refresh triggered');
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



  const handleImageUpload = async () => {
    // console.log('Handling upload for user:', user.id);

    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      // console.log('Permission result:', permissionResult);

      if (!permissionResult.granted) {
        // console.log('Permission to access gallery was denied');
        alert('Permission to access gallery is required!');
        return;
      }

      // console.log('Permission granted for media library access.');
      
      // Launch the image picker
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      setLoading(true);
      // console.log('Picker result:', pickerResult);

      if (pickerResult.canceled) {
        // console.log('User canceled image picker.');
        setLoading(false);
        return;
      }

      const { uri, base64 } = pickerResult.assets[0];

      // console.log('Selected image URI:', uri);
      // console.log('Base64 Data (first 50 chars):', base64?.slice(0, 50));

      if (!base64) {
        console.error('No base64 data found.');
        return;
      }

      // Generate a file name based on the user ID and current timestamp
      const fileName = `${Date.now()}-${user.id}.png`;

      // Decode base64 to ArrayBuffer for upload
      const fileData = decode(base64);

      // console.log('Decoded file data length:', fileData.byteLength);

      // Upload the image to Supabase storage
      const { data, error } = await supabase.storage
        .from('busylittleplatform')
        .upload(`public/${fileName}`, fileData, {
          contentType: 'image/png',
        });

      if (error) {
        console.error('Error uploading image:', error);
        Toast.show({
          type: 'error',
          text1: 'Image Upload Failed',
          text2: error.message,
        });
        return;
      }

      // console.log('Image uploaded successfully:', data);

      // Get the public URL of the uploaded image
      const { data: publicUrlData, error: publicUrlError } = supabase
        .storage
        .from('busylittleplatform')
        .getPublicUrl(`public/${fileName}`);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return;
      }

      const publicUrl = publicUrlData.publicUrl;
      // console.log('Public URL of uploaded image:', publicUrl);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        Toast.show({
          type: 'error',
          text1: 'Profile Update Failed',
          text2: updateError.message,
        });
        setLoading(false);
      } else {
        setAvatarUrl(publicUrl);
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error during image upload:', error);
      setLoading(false);
    }
  };
    

  // Setting the header right icon to trigger loadDataFromStorage
  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false, // Ensures the back button text is visible
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
    setAvatarUrl(profile?.avatar_url || ''); // Set avatar URL if available
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

    if (avatarUrl && avatarUrl !== profile?.avatar_url) {
      updates.avatar_url = avatarUrl;
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
        // console.log('should refresh user details');
    }, 2000);
  }, []);

  const filteredCities = selectedCities && selectedCities.filter(city => city.toLowerCase());
  useImperativeHandle(ref, () => ({
    triggerRefresh, // Expose the triggerRefresh method
  }));

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
        {/* <Text style={styles.title}>Update Profile Details</Text> */}
        <Spacer space={20} />
        {/* {user && (
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
            </View>
          </View>
        )} */}

        
          <View style={styles.profileHeader}>
            <ImageUploader 
              avatarUrl={avatarUrl} 
              loading={loading} 
            />
            <Button style={{ color: '#000'}} title="Upload Profile Picture" onPress={handleImageUpload} />

            {/* <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? 'lightgray' : 'gray', // Dim the color when pressed
                  alignItems: 'center',
                  paddingVertical: 10,
                  width: '80%',
                  justifyContent: 'center'
                }
              ]}
              onPress={handleImageUpload}
            >
              <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
            </Pressable> */}
          
          
          </View>
        

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
            <Text style={styles.inlineLabel}>Full Name:</Text>
            <TextInput
              placeholder={profile?.full_name}
              placeholderTextColor='#000'
              clearTextOnFocus={true}
              value={full_name}
              onChangeText={setFullname}
              autoCapitalize={"none"}
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

         

          <Text style={styles.label}>Manage cities:</Text>
          <View style={styles.inputStyle}>
            {filteredCities.length > 0 ? filteredCities.map((city) => (
              <View key={city} style={styles.selectedCity}>
                <Text>{city}</Text>
                <Button title="Remove" onPress={() => removeCity(city)} />
              </View>
            )): <Text>No cities selected.</Text>}
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 4, width:'100%', position:'relative', paddingVertical: 10 }}>
            <UpdateButton title="Update" onPress={handleUpdate} />
            <ProfileButton title="Back to Profile" onPress={() => navigation.replace('Account', { user })} style={{ marginBottom: 10, paddingBottom: 20 }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
});

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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 0,
    width: '50%'
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'normal',
  },
  uploadButtonText: {
    color: '#000', // White text
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
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageLoading: {
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
  },
  progressBar: {
    marginTop: 10,
  },
});

export default UpdateDetailsScreen;
