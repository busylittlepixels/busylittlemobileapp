import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, ActivityIndicator } from 'react-native';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const UserArticles = ({ navigation, filters, userId }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchFavorites(); // Fetch favorites from storage
    fetchArticles(); // Fetch articles from API
  }, [filters]);

  const fetchFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news');
      const data = await response.json();

      // Apply filters if any
      const filteredData = filters
        ? data.filter((article: { [x: string]: any }) => {
            return Object.keys(filters).every((key) => article[key] === filters[key]);
          })
        : data;

      setArticles(filteredData);

      // Initialize favorites state if not already loaded
      if (Object.keys(favorites).length === 0) {
        const initialFavorites = filteredData.reduce((acc: any, article: any) => {
          acc[article.id] = false; // Set all to false initially
          return acc;
        }, {});
        setFavorites(initialFavorites);
      }
    } catch (err) {
      // @ts-ignore
      setError(err.message);
    }
    setLoading(false);
  };

  const handleToggleFavorite = async (articleId: any) => {
    const isFavorite = favorites[articleId];
    const result = await toggleFavoriteService(userId, articleId);

    if (result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Not added to favorites.',
      });
    } else {
      const updatedFavorites = {
        ...favorites,
        [articleId]: !isFavorite,
      };
      setFavorites(updatedFavorites);

      // Save updated favorites to AsyncStorage
      try {
        await AsyncStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      } catch (err) {
        console.error('Failed to save favorites:', err);
      }

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: isFavorite ? 'Removed from your favorites.' : 'Added to your favorites.',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [favorites])
);


  return (
    <View style={styles.articleList}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          <Text style={styles.innerContainer}>Articles:</Text>
            <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Pressable onPress={() => navigation.navigate('Article', { item })}>
                  <Text style={styles.title}>
                    {item.title.rendered} {item.id}
                  </Text>
                </Pressable>

                <Button
                  onPress={() => handleToggleFavorite(item.id)}
                  title={favorites[item.id] ? '✓' : '-'}
                />
              </View>
            )}
            extraData={favorites}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  articleList: {
    marginTop: 10,
  },
  innerContainer: {
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 20,
    paddingBottom: 10,
    fontWeight: 'bold',
    fontSize: 24,
  },
  item: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    gap: 4,
    padding: 16,
  },
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10,
  },
});

export default UserArticles;
