// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Animated, RefreshControl, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser, useSignOutMutation } from "../../services/auth/authApi";
import { supabase } from '../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Asset } from 'expo-asset';
import { enablePublicProfile } from '@/app/services/settingsService';

const FriendProfileScreen = ({ navigation, route }: any) => {
  const [profile, setProfile] = useState('');
  const [isPending, setIsPending] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_MAX_HEIGHT = 120;
  const HEADER_MIN_HEIGHT = 80;
  const AVATAR_MAX_SIZE = 100;
  const AVATAR_MIN_SIZE = 75;

  const paddingVertical = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [20, 5],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const avatarSize = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],
    outputRange: [AVATAR_MAX_SIZE, AVATAR_MIN_SIZE],
    extrapolate: 'clamp',
  });

  const user = useSelector(selectCurrentUser);

  const avatarImage = Asset.fromModule(require('./../../assets/images/blp-splash.png')).uri;
  const imageUrl = avatarImage;

  const fetchUserData = useCallback(async () => {
    if (!route.params.user || !route.params.user.id) return;
    try {
      const [{ data: userDetails, error: userError }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', route.params.user.id).single(),
      ]);

      if (userError) throw new Error(userError.message);
      setProfile(userDetails);
    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
    }
  }, [route.params?.id]);

  const fetchData = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchUserData])
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToProfile = () => {
    const paramsUser = route.params.user.full_name;
    const paramsAvatar = route.params.user.avatar;
    navigation.navigate("Chat", { senderId: user.id, receiverId: route.params.user.id, otherUserName: paramsUser, otherUserAvatar: paramsAvatar });
  };

  const sendConnectionRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .insert([{ sender_id: user.id, receiver_id: route.params.user.id, status: 'pending' }]);
  
      if (error) {
        // Error during sending the request
        Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Failed to send connection request' });
      } else {
        // Request successfully sent
        Toast.show({ type: 'success', text1: 'Success', text2: 'Connection request sent' });
        setIsPending(true);  // Mark request as pending
      }
    } catch (err) {
      console.error('Error sending connection request:', err.message);
      Toast.show({ type: 'error', text1: 'Error', text2: 'An unexpected error occurred' });
    }
  };
  
  const cancelConnectionRequest = async () => {
    try {
      const response = await supabase
        .from('connection_requests')
        .delete()
        .eq('sender_id', user.id)
        .eq('receiver_id', route.params.user.id)
        .eq('status', 'pending');
  
      if (response.error) {
        // Handle error from Supabase
        Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Failed to cancel connection request' });
      } else if (response.data && response.data.length > 0) {
        // Request successfully canceled
        Toast.show({ type: 'success', text1: 'Success', text2: 'No pending request to cancel' });
        setIsPending(false);  // Update the state to reflect no pending request
      } else {
        // No matching request to cancel
        setIsPending(false);  // No pending request
        Toast.show({ type: 'error', text1: 'Request Cancelled' });
      }
    } catch (err) {
      console.error('Failed to cancel request:', err.message);
      Toast.show({ type: 'error', text1: 'Error', text2: 'An unexpected error occurred' });
    }
  };
  
  const checkIsPending = async () => {
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', route.params.user.id)
        .eq('status', 'pending');
  
      if (error) {
        console.error('Error checking pending request:', error);
        return false;  // Assuming no pending request if there's an error.
      }
  
      if (data && data.length > 0) {
        // console.log('Pending request exists:', data);
        setIsPending(true)
        return true;  // Pending request found.
      } else {
        // console.log('No pending request.');
        setIsPending(false)
        return false;  // No pending request.
      }
    } catch (err) {
      console.error('Failed to check pending request:', err.message);
      return false;  // Return false on any other failure.
    }
  };
  
  useEffect(() => {
    checkIsPending(); 
  },[])

  useFocusEffect(
    useCallback(() => {
      checkIsPending(); 
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animated.View style={[styles.avatarContainer, { height: headerHeight, paddingVertical }]}>
        {route.params.user && (
          <View style={styles.userInfoContainer}>
            <Animated.Image
              source={{ uri: route.params.user.avatar ? route.params.user.avatar : imageUrl }}
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
            />
            <View style={styles.textContainer}>
              <Text style={styles.screenTitle}>{route.params.user.full_name || user.user_metadata?.full_name}</Text>
              <Text style={styles.screenSub}>{route.params.user.name || user.user_metadata?.name}</Text>
              <Text style={styles.screenSubSmaller}>{route.params.user.email || user.user_metadata?.email}</Text>
            </View>
          </View>
        )}
      </Animated.View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10, }}>
        {isPending ? 
          <Pressable style={styles.pendingButton} onPress={cancelConnectionRequest}>
          <Text style={styles.pendingButtonText}>{'Cancel Pending Request'}</Text>
        </Pressable>
        :
        <Pressable style={styles.connectButton} onPress={sendConnectionRequest}>
          <Text style={styles.connectButtonText}>{'Connect'}</Text>
        </Pressable>}
        <Pressable style={styles.messageButton} onPress={goToProfile}>
          <Text style={styles.messageButtonText}>Message</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'green',
  },
  textContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  screenSub: {
    fontSize: 16,
    color: '#f3f3f3',
    marginTop: 5,
  },
  screenSubSmaller:{
    fontSize: 14,
    color: 'lightgray',
    marginTop: 5,
  },
  connectButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  pendingButton:{
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pendingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  messageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FriendProfileScreen;
