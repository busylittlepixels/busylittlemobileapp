// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Animated, RefreshControl, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Asset } from 'expo-asset';
import { enablePublicProfile } from '@/app/services/settingsService';

const FriendProfileScreen = ({ navigation, route }: any) => {
  const [profile, setProfile] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_MAX_HEIGHT = 120;
  const HEADER_MIN_HEIGHT = 80;
  const AVATAR_MAX_SIZE = 95;
  const AVATAR_MIN_SIZE = 55;

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

  const user = useSelector((state) => state.auth.user);

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
    const { data, error } = await supabase
      .from('connection_requests')
      .insert([{ sender_id: user.id, receiver_id: route.params.user.id, status: 'pending' }]);

    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Connection request already sent' });
    } else {
      Toast.show({ type: 'success', text1: 'Success', text2: 'Connection request sent' });
    }
  };

  const sendMessage = () => {
    Alert.alert('navigate to message screen')
  }

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
        <Pressable style={styles.connectButton} onPress={sendConnectionRequest}>
          <Text style={styles.connectButtonText}>Connect</Text>
        </Pressable>
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
    justifyContent: 'flex-start',
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
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  messageButtonText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FriendProfileScreen;
