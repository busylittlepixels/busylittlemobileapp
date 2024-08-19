// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, ScrollView, RefreshControl, Image, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HorizontalScroller from '../components/HorizontalScroller';
import CitiesGrid from '../components/CitiesGrid';
import EventsGrid from '../components/EventsGrid';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';

const AccountScreen = ({ navigation }:any) => {
  const dispatch = useDispatch();

  // Access Redux state
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const isFirstLaunch = useSelector((state) => state.auth.isFirstLaunch);

  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState({});

  const fetchData = async () => {
    if (!user || !user.id) return;

    try {
      // Fetch user profile, cities, and tickets in parallel
      const [{ data: userDetails, error: userError }, 
             { data: citiesData, error: citiesError }, 
             { data: ticketsData, error: ticketsError }] = await Promise.all([
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

      // Fetch and set favorites
      const savedFavorites = await AsyncStorage.getItem(`favorites_${user.id}`);
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : {});

      // Fetch and set articles
      const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const articlesData = await response.json();
      setArticles(articlesData);

    } catch (err) {
      console.error('Failed to fetch data:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.accountDetails}>
        <Text style={styles.sectionTitle}>Account:</Text>
        {user && (
          <>
            <Text>Hey {profile?.username || user.user_metadata?.username}</Text>
            <Text>Email: {user.email}</Text>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest:</Text>
        <HorizontalScroller />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Selected Cities:</Text>
        <CitiesGrid cities={profile?.cities || cities} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events:</Text>
        <EventsGrid tickets={tickets} />
      </View>

      <View style={styles.section}>
        <Text style={styles.articleSectionTitle}>Articles:</Text>
        <View>
          {articles.map(item => (
            <View key={item.id} style={styles.item}>
              <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
                <Image style={styles.tinyLogo} source={{ uri: 'https://via.placeholder.com/50/800080/FFFFFF' }} />
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.title.rendered}
                  </Text>
                  <Text style={styles.description}>Here's some description...</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleToggleFavorite(item.id, item.title?.rendered, item.slug, item.content?.rendered)}
                style={styles.favoriteButton}
              >
                <Ionicons 
                  name={favorites[item.id] ? 'checkmark-circle-outline' : 'remove-outline'} 
                  size={24} 
                  color={favorites[item.id] ? 'green' : 'gray'} 
                />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { },
  accountDetails: { padding: 20, backgroundColor: '#e1e1e1', elevation: 5 },
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
});

export default AccountScreen;
