// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase';

const FavoritesScreen = ({ navigation, route }: any) => {
  const user = useSelector((state) => state.auth.user);
  const [favorites, setFavorites] = useState([]);

  // Function to fetch favorites from AsyncStorage
  const fetchFavoritesFromStorage = useCallback(async () => {
    console.log('Fetching favorites from AsyncStorage');
    try {
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};

      // If there are favorite articles, fetch their full data from the database
      if (Object.keys(parsedFavorites).length > 0) {
        console.log('Fetching full article data for favorites:', Object.keys(parsedFavorites));
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user?.id);

        if (data) {
          const normalizedData = data.map((item) => {
            // Ensure content and title are correctly formatted
            const normalizedTitle = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;
            const normalizedContent = typeof item.content === 'object' && item.content.rendered ? item.content.rendered : item.content;

            return { ...item, title: normalizedTitle, content: normalizedContent };
          });

          setFavorites(normalizedData);
          // console.log('Fetched and normalized article data:', normalizedData);
        } else if (error) {
          console.error('Error fetching full article data:', error);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites from AsyncStorage:', error);
    } finally {
      console.log('Finished fetching favorites');
    }
  }, [user?.id]);

  // Fetch favorites on focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, fetching favorites...');
      fetchFavoritesFromStorage();
    }, [route, fetchFavoritesFromStorage])
  );

  // Fetch favorites if route parameter indicates so
  useEffect(() => {
    if (route.params?.refetchFavorites) {
      console.log('Route parameter refetchFavorites is true, fetching favorites...');
      fetchFavoritesFromStorage();
    }
  }, [route.params?.refetchFavorites, fetchFavoritesFromStorage]);

  return (
    <View style={styles.titleContainer}>
      {user && <Text style={{ color: "red", fontSize: 20 }}>Favorite Articles for user: {user?.email}</Text>}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.faveTitle}>Favourite Articles</Text>
        {favorites.length > 0 ? (
          favorites.map((item, index) => {
            // console.log('Rendering favorite item:', item);
            let normalizedTitle = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;

            return (
              <Pressable 
                key={index}
                onPress={() => {
                  // Ensure normalized title and content
                  const normalizedTitle = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;
                  const normalizedContent = typeof item.content === 'object' && item.content.rendered ? item.content.rendered : item.content;

                  // Pass normalized data to ArticleScreen
                  navigation.navigate("Article", { 
                    item: { ...item, title: normalizedTitle, content: normalizedContent },
                    isFavorite: true  // Ensure isFavorite is passed correctly
                  });
                }}
              >
                <Text style={styles.faveLinks}>{normalizedTitle}</Text>
              </Pressable>
            );
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
