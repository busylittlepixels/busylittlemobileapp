// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Animated, RefreshControl, Image, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser, useSignOutMutation } from "../../services/auth/authApi";
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
import { RootState } from '../../store'; // Adjust the path if needed
import { enablePublicProfile } from '@/app/services/settingsService';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigation } from '@react-navigation/native';

const GreenDot = () => {
  return <View style={styles.greenDot} />;
};

const RedDot = () => {
  return <View style={styles.redDot} />;
};


const AccountScreen = ({ navigation, route }: any) => {
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

  const dotSize = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],  
    outputRange: [16, 12],  // Dot size shrinks from 16 to 10
    extrapolate: 'clamp',
  });
  
  const dotPosition = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) * 1.5],  
    outputRange: [6, 4],  // Adjust the position of the dot as the avatar shrinks
    extrapolate: 'clamp',
  });
  
  
  // Access Redux state and get the user
  const user = useSelector((state: RootState) => state?.root?.auth?.selectCurrentUser);

  useEffect(() => {
    if (!user || !user.id) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }
  }, [user, navigation]);

  // duh
  const showAdverts = useSelector((state: RootState) => state?.root?.settings?.showAdverts);
  const enablePublicProfile = useSelector((state: RootState) => state?.root?.settings?.enablePublicProfile);
  const showNotifications = useSelector((state: RootState) => state?.root?.settings?.showNotifications);
  // also duh
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState({});

  // const avatarBlipImage = Asset.fromModule(require('./../../assets/images/marathon6.png')).uri;
  const avatarImage = Asset.fromModule(require('./../../assets/images/blp-splash.png')).uri;
  const imageUrl = avatarImage;

  // Fetch favorites from AsyncStorage
  const fetchFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  }, [user?.id]);

  // Fetch user-related data.
  // Gonna throw this into a callback because there's a few bits need hydrating and we don't want to be making 
  // needless calls all over the place. 

  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const [{ data: userDetails, error: userError }, { data: citiesData, error: citiesError }, { data: ticketsData, error: ticketsError }, { data: eventsData, error: eventsError }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('cities').eq('id', user.id).single(),
        supabase.from('tickets').select('*'),
        supabase.from('events').select('*')
      ]);

      if (userError) throw new Error(userError.message);
      setProfile(userDetails);

      if (citiesError) throw new Error(citiesError.message);
      setCities(citiesData?.cities || []);

      if (ticketsError) throw new Error(ticketsError.message);
      setTickets(ticketsData);
    
      if (eventsError) throw new Error(eventsError.message);
      setEvents(eventsData);

    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
    }
  }, [user?.id]);

  // Fetch articles from external API
  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news?_embed&per_page=20', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const articlesData = await response.json();
      setArticles(articlesData);
    } catch (err) {
      console.error('Failed to fetch articles:', err.message);
    }
  }, []);

  // Combined data fetching
  const fetchData = useCallback(async () => {
    await fetchUserData();
    await fetchFavorites();
    await fetchArticles();
  }, [fetchUserData, fetchFavorites, fetchArticles]);

  // When user returns to the page, do a quick call to refresh the favorites
  // in case anything has changed.  
  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchFavorites();
    }, [fetchUserData, fetchFavorites])
  );

  useEffect(() => {
    // console.log("user? :", user?.id);
    // Fetch the data on initial load. 
    fetchData();
  }, [fetchData]);


  const goToProfile = () => {
    navigation.navigate("Profile")
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  const handleToggleFavorite = async (articleId, title, slug, content, featuredMedia) => {
    
    const isFavorite = favorites[articleId];
    const serializedContent = JSON.stringify(content);
    const result = await toggleFavoriteService(user?.id, articleId, title, slug, serializedContent, featuredMedia);

    if (result.error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
    } else {
      const updatedFavorites = { ...favorites, [articleId]: !isFavorite };
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
      Toast.show({ type: 'success', text1: 'Success', text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.' });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.avatarContainer, { height: headerHeight, paddingVertical }]}>
      {user && (
        <View style={styles.userInfoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.screenTitle}>Hey {profile?.username || user.user_metadata?.username}</Text>
            <Text style={styles.screenSub}>{profile?.email || user?.email}</Text>
          </View>
          <Pressable onPress={goToProfile} style={{ position: 'relative' }}>
            <Animated.Image
              source={{ uri: profile?.avatar_url ? profile?.avatar_url : imageUrl }}
              style={[styles.tinyLogo, { width: avatarSize, height: avatarSize, paddingLeft: 5, borderColor: enablePublicProfile ? 'green' : 'white' }]}
            />
            <Animated.View 
              style={[
                styles.dotContainer, 
                { 
                  width: dotSize, 
                  height: dotSize, 
                  left: dotPosition,  // Adjusts dot's position to left
                  bottom: dotPosition // Adjusts dot's position to bottom
                }
              ]}
            >
              {enablePublicProfile && <GreenDot />}
            </Animated.View>
          </Pressable>
        </View>
      )}
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest:</Text>
          <HorizontalScroller />
        </View>

        {showAdverts && (
          <AdBanner color={'#f00000'} image='https://placehold.co/500x100' subtitle="This is the water, and this is the well. Drink full, and descend. The horse is the white of the eyes, and dark within" />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Selected Cities:</Text>
          <CitiesGrid cities={profile?.cities || cities} />
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events:</Text>
          <EventsGrid items={events} />
        </View>
        
      
        {showAdverts && (
          <AdBanner color={'#008000'} image='https://placehold.co/500x100' subtitle="Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light?" />
        )}

        <View style={styles.section}>
          <Text style={styles.articleSectionTitle}>Latest Articles:</Text>
          <View>
          {articles.map(item => {
              return(<ArticleItem
                key={item.id}
                item={item}
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={handleToggleFavorite}
                featuredMedia={item?._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              />)
            })}
          </View>
        </View>
      </ScrollView>
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
    position: 'relative'
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
  screenMicroContainer:{
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  screenMicro: {
    fontSize: 10,
    fontWeight: '400',
    color: '#fff',  
  },
  tinyLogo: {
    borderRadius: 50,
    borderWidth: 2,
    paddingLeft: 2,
    marginLeft: 5,
    position: 'relative', // Ensure relative positioning of the avatar
  },
  dotContainer: {
    position: 'absolute',  // Absolutely position the dot
    borderRadius: 8,
  },
  greenDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'green',
  },
  redDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
  },
});

export default AccountScreen;
