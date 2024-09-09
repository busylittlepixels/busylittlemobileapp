// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Animated, RefreshControl, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HorizontalScroller from '../../components/HorizontalScroller';
import CitiesGrid from '../../components/CitiesGrid';
import EventsGrid from '../../components/EventsGrid';
import ParallaxScrollAvatar from '../../components/ParallaxScrollAvatar';
import AdBanner from '../../components/AdBanner';
import ArticleItem from '../../components/ArticleItem';
import Spacer from '../../components/Spacer';
import { toggleFavorite as toggleFavoriteService } from '../../services/favouriteService';
import { Asset } from 'expo-asset';
import { enablePublicProfile } from '@/app/services/settingsService';

const FriendProfileScreen = ({ navigation, route }: any) => {
    const [profile, setProfile] = useState(''); 
  // track vertical scroll
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // set values for scrolly header
  const HEADER_MAX_HEIGHT = 120;
  const HEADER_MIN_HEIGHT = 80;
  const AVATAR_MAX_SIZE = 95;
  const AVATAR_MIN_SIZE = 55;

  // apply some additional padding when the thingy shrinks on scroll
  const paddingVertical = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [20, 5],  // Adjusts padding from 20 to 5 as you scroll
    extrapolate: 'clamp',
  });
  
  // controls the headerHeight on scroll
  const headerHeight = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],  // Throttle speed by adjusting input range
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  // controls the avatar size on scroll
  const avatarSize = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],  // Throttle speed by adjusting input range
    outputRange: [AVATAR_MAX_SIZE, AVATAR_MIN_SIZE],
    extrapolate: 'clamp',
  });
  
  // Access Redux state and get the user
  const user = useSelector((state) => state.auth.user);

  const avatarBlipImage = Asset.fromModule(require('./../../assets/images/marathon6.png')).uri;
  const avatarImage = Asset.fromModule(require('./../../assets/images/blp-splash.png')).uri;
  const imageUrl = avatarImage;


  const ChatButton = ({ title, onPress }) => {
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
  // Fetch user-related data.
  // Gonna throw this into a callback because there's a few bits need hydrating and we don't want to be making 
  // needless calls all over the place. 

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

  // Fetch articles from external API


  // Combined data fetching
  const fetchData = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  // When user returns to the page, do a quick call to refresh the favorites
  // in case anything has changed.  
  useFocusEffect(
    useCallback(() => {
      fetchData();
      
    }, [fetchUserData])
  );

  useEffect(() => {
    // console.log("user? :", user?.id);
    // Fetch the data on initial load. 
    fetchData();
  }, [fetchData]);


  const goToProfile = () => {
    navigation.navigate("Chat", { senderId: user.id, receiverId: route.params.user.id });
  }


  const sendConnectionRequest = async () => {
      // navigation.navigate("Chat", { senderId: user.id, receiverId: route.params.user.id });
      const { data, error } = await supabase
        .from('connection_requests')
        .insert([
          { sender_id: user.id, receiver_id: route.params.user.id, status: 'pending' }
        ]);

        if (error) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send connection rquestion' });
        } else {
          Toast.show({ type: 'success', text1: 'Success', text2: 'Connection request sent' });
        }
  }



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  console.log(route.params.user.id)

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.avatarContainer, { height: headerHeight, paddingVertical }]}>
        {route.params.user && (
          <View style={styles.userInfoContainer}>
            <View style={styles.textContainer}>
            <Text style={styles.screenTitle}>{route.params.user.full_name || user.user_metadata?.full_name}</Text>
              <Text style={[styles.screenTitle, { fontSize: 12}]}>{route.params.user.name || user.user_metadata?.name}</Text>
            </View>
            <Pressable  onPress={goToProfile}>
            <Animated.Image
              source={{ uri: route.params.user.avatar ? route.params.user.avatar : imageUrl }}
              style={[styles.tinyLogo, { width: avatarSize, height: avatarSize, paddingLeft: 5, borderColor: enablePublicProfile ? 'green' : 'white', }]}
            />
            </Pressable>
          </View>
        )}
      </Animated.View>
      <View>
        <Pressable  onPress={sendConnectionRequest}>
          <Text>Connect</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {},
  accountDetails: { padding: 20, position: 'relative', backgroundColor: '#000', elevation: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { padding: 20, backgroundColor: '#ffffff', elevation: 5 },
  eventsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  articleSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  articlePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tinyLogo: {
    borderRadius: '50%',
    borderWidth: 2,
    paddingLeft: 2,
    marginLeft: 5,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: 10,
    marginVertical: 5
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: '100%',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  avatarContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#000',
    justifyContent: 'center'
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  screenSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff'
  },
  screenMicro: {
    fontSize: 10,
    fontWeight: '400',
    color: '#fff'
  }
});

export default FriendProfileScreen;
