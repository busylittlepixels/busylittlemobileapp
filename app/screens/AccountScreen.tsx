// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, Animated, RefreshControl, Image, Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HorizontalScroller from '../components/HorizontalScroller';
import CitiesGrid from '../components/CitiesGrid';
import EventsGrid from '../components/EventsGrid';
import ParallaxScrollAvatar from '../components/ParallaxScrollAvatar';
import AdBanner from '../components/AdBanner';
import ArticleItem from '../components/ArticleItem';
import Spacer from '../components/Spacer';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';

const AccountScreen = ({ navigation }: any) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Access Redux state
  const user = useSelector((state) => state.auth.user);
  const showAdverts = useSelector((state) => state.auth.showAdverts);

  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState({});

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

  // Fetch user-related data
  const fetchUserData = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const [{ data: userDetails, error: userError }, { data: citiesData, error: citiesError }, { data: ticketsData, error: ticketsError }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('cities').eq('id', user.id).single(),
        supabase.from('tickets').select('*')
      ]);

      if (userError) throw new Error(userError.message);
      setProfile(userDetails);

      if (citiesError) throw new Error(citiesError.message);
      setCities(citiesData?.cities || []);

      if (ticketsError) throw new Error(ticketsError.message);
      setTickets(ticketsData);

    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
    }
  }, [user?.id]);

  // Fetch articles from external API
  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news', {
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

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  const handleToggleFavorite = async (articleId, title, slug, content) => {
    const isFavorite = favorites[articleId];
    const serializedContent = JSON.stringify(content);
    const result = await toggleFavoriteService(user?.id, articleId, title, slug, serializedContent);

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
      <Animated.View style={styles.avatarContainer}>
        {user && (
          <View style={styles.userInfoContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.screenTitle}>Hey {profile?.username || user.user_metadata?.username}</Text>
              <Text style={styles.screenSub}>{profile?.email || user?.email}</Text>
            </View>
            <ParallaxScrollAvatar
              imageUrl={null}
              name={profile?.username || user.user_metadata?.username}
            />
          </View>
        )}
      </Animated.View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
          <Text style={styles.sectionTitle}>Events:</Text>
          <EventsGrid tickets={tickets} />
        </View>

        {showAdverts && (
          <AdBanner color={'#008000'} image='https://placehold.co/500x100' subtitle="Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light? Gotta light?" />
        )}

        <View style={styles.section}>
          <Text style={styles.articleSectionTitle}>Articles:</Text>
          <View>
          {articles.map(item => (
              <ArticleItem
                key={item.id}
                item={item}
                isFavorite={favorites[item.id]}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
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
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
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
    padding: 20,
    backgroundColor: '#000'
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  }
});

export default AccountScreen;
