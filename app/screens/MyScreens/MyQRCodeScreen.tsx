// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';

export default function MyQRCodeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user); // Fetch current user from Redux
 

  console.log('user', user.id); 

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getUserProfile(user.id); // Fetch the profile for the current user
      if (userProfile) {
        setProfile(userProfile);
      }
      setLoading(false); // Stop the loading indicator
    };

    fetchProfile();
  }, [user]);

  const userId = user.id; 
  // Fetch the user's profile data (full name, email, website)
  const getUserProfile = async (userId) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, full_name, email, website')
        .eq('user_id', userId);

      if (error && status !== 406) {
        throw error;
      }

      if (data && data.length > 0) {
        return data[0]; // Return the first matching profile record
      }
    } catch (error) {
      console.log('Error fetching profile:', error.message);
      return null;
    }
  };

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#000000" />;
  // }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Error loading profile data.</Text>
      </View>
    );
  }

  // Generate the data to be encoded in the QR code
  const qrData = JSON.stringify({
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    website: profile.website,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <Text style={styles.description}>Scan this QR code to share your contact info.</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData} // The profile data encoded as a JSON string
          size={250}
          color="black"
          backgroundColor="white"
        />
      </View>

      <Button title="Back to Camera" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    marginBottom: 20,
  },
});
