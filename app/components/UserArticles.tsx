import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Button, Pressable } from 'react-native';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UserArticles = ({ filters, userId }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation(); 

  const fetchData = async () => {
    setLoading(true);
    try {
        // Fetch favorites first
        const savedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
        const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
        setFavorites(parsedFavorites);

        // Then fetch articles
        const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news',{
          headers: {
            'Content-Type': 'application/json',
            // Add other headers if needed
          }
        });
        const data = await response.json();

        const filteredData = filters
            ? data.filter((article:any) => Object.keys(filters).every((key) => article[key] === filters[key]))
            : data;

        setArticles(filteredData);
    } catch (err) {
      // @ts-ignore
        setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
      fetchData();
  }, []);

    
  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch favorites from storage
    }, [])
  );

  const handleToggleFavorite = async (articleId: string | number, title: any, slug: any, content: any) => {
    const isFavorite = favorites[articleId];
    const serializedContent = JSON.stringify(content);
    const result = await toggleFavoriteService(userId, articleId, title, slug, serializedContent);

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

  return (
    <View style={styles.container}>
      {articles && articles.length > 0 ? (
        articles.map((item: any) => (
          <View key={item.id.toString()} style={styles.item}>
            {/* @ts-ignore */}
            <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
              <Image style={styles.tinyLogo} source={{ uri: 'https://via.placeholder.com/50/800080/FFFFFF' }} />
              <View>
                <Text style={styles.title}>{item.title.rendered}</Text>
                <Text>Here's some bullshit to go with it...</Text>
              </View>
            </Pressable>
            <Button
              onPress={() => handleToggleFavorite(item.id, item.title.rendered, item.slug, item.content.rendered)}
              title={favorites[item.id] ? '✓' : '-'}
            />
          </View>
        ))
      ) : (
        <Text>No articles found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  articlePressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
});

export default UserArticles;
