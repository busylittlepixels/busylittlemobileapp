import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, Pressable, ActivityIndicator } from 'react-native';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';
import Toast, { ErrorToast } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const UserArticles = ({ filters, userId }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchFavorites(); // Fetch favorites from storage
    fetchArticles(); // Fetch articles from API
  }, []);

  const fetchFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
      if (JSON.stringify(parsedFavorites) !== JSON.stringify(favorites)) {
        setFavorites(parsedFavorites);
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

      // console.log('filtered', filteredData);

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

  const handleToggleFavorite = async (articleId: any, title: any, slug: any, content: any) => {
    const isFavorite = favorites[articleId];
    const serialisedContent = JSON.stringify(content);
    // console.log('serialised', serialisedContent)
    const result = await toggleFavoriteService(userId, articleId, title, slug, serialisedContent);

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

  const placeHolderImage = { uri: 'https://via.placeholder.com/50/800080/FFFFFF'};

  useEffect(() => {
    console.log('Screen focused, fetching favorites');
    fetchFavorites();
    // No dependencies to prevent unnecessary loops

   
  },[favorites]);

  return (
    <View style={styles.articleList}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                {/* @ts-ignore */}
                <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
                  <Image
                    style={styles.tinyLogo}
                    source={placeHolderImage}
                  /> 
                  <View>
                    <Text style={styles.title}>
                      {item.title.rendered} {/*{{item.id} {item.slug}*/}
                    </Text>
                    <Text>Here's some bullshit to go with it...</Text>
                  </View>
                </Pressable>

                <Button
                  onPress={() => handleToggleFavorite(item.id, item.title.rendered, item.slug, item.content.rendered)}
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
    justifyContent: 'space-between'
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
  tinyLogo: {
    width: 50,
    height: 50,
  },
  articlePressable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5
  }
});

export default UserArticles;
