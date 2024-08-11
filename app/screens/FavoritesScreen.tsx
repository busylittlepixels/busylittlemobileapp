import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../../supabase'; // Ensure your Supabase client is correctly imported
import { useFocusEffect } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// @ts-ignore
const FavoritesScreen = ({ navigation, route }: Props) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorites')  // Ensure you use the correct table name, "favorites" or "favourites"
        .select('article_id, title, article_slug, content')  // Fetch the necessary fields
        .eq('user_id', user?.id);
  
      if (favoriteError) {
        console.error('Error fetching favorites:', favoriteError);
        return;
      }
      
      if (favoriteData) {
        setFavorites(favoriteData); // Directly set favoriteData as the new state
      } else {
        console.error('favoriteData is null or undefined');
      }
    } catch (error) {
      console.error('Error during fetchFavorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  // console.log('faves on list', favorites);

  return (
    <ThemedView style={styles.titleContainer}>
      {user && <Text style={{"color": "red","fontSize": 20}}>Favorite Articles for user: {user?.email}</Text>}
      <View>
        <Text style={styles.faveTitle}>Favourite Articles</Text>
        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <View key={index}>
              <Pressable onPress={() => navigation.navigate("Article", { item })}>
                <Text style={styles.faveLinks}>{item.title}</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.noCont}>No favorites as of yet</Text>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  noCont: {
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    color: 'white',
    paddingTop: 20,
    paddingHorizontal: 16
  },
  faveTitle: {
    color: 'white', 
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold' 
  },
  faveLinks: {
    color: 'white', 
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold' 
  }
});

export default FavoritesScreen;
