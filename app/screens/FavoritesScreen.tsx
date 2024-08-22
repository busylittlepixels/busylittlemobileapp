// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../supabase'; // Ensure your Supabase client is correctly imported
import { ThemedView } from '@/app/components/ThemedView';

const FavoritesScreen = ({ navigation, route }: any) => {
  const user = useSelector((state) => state.auth.user);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch favorite articles from the database
  const fetchFavorites = async () => {
    setRefreshing(true);
    try {
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id);
  
      if (favoriteError) {
        console.error('Error fetching favorites:', favoriteError);
        return;
      }

      setFavorites(favoriteData || []);
    } catch (error) {
      console.error('Error fetching favorites from database:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [route])
  );

  useEffect(() => {
    if (route.params?.refetchFavorites) {
      fetchFavorites();
    }
  }, [route.params?.refetchFavorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites().finally(() => setRefreshing(false));
  }, []);



  return (
    <View style={styles.titleContainer}>
      {user && <Text style={{ color: "red", fontSize: 20 }}>Favorite Articles for user: {user?.email}</Text>}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.faveTitle}>Favourite Articles</Text>
        {favorites.length > 0 ? (
          favorites.map((item, index) => {
            console.log('Full item.title object:', item.title);
            const normalizedTitle = item.title ? item.title : item.title.rendered;

            console.log('normalizedTitle:', normalizedTitle);
            return (
              <View key={index}>
                <Pressable 
                  onPress={() => navigation.navigate("Article", { item, isFavorite: true })}
                >
                  <Text style={styles.faveLinks}>{normalizedTitle}</Text>
                </Pressable>
              </View>
            )
          })
        ) : (
          <Text style={styles.noCont}>No favorites as of yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    color: 'black',
  },
  noCont: {
    color: '#000',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    color: '#000',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  faveTitle: {
    color: '#000', 
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  faveLinks: {
    color: 'black', 
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
