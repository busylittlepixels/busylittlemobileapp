import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Button, Pressable } from 'react-native';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const UserArticles = ({ filters, userId }: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchFavorites().then(() => fetchArticles()); // Ensure favorites are loaded firstge
  }, []);

  const fetchFavorites = async () => {
    try {
        const savedFavorites = await AsyncStorage.getItem(`favorites_${userId}`);
        const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

        // Update the state only if the fetched favorites are different
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

        // Set favorites based on fetched articles and stored favorites
        const updatedFavorites = filteredData.reduce((acc: any, article: any) => {
            acc[article.id] = favorites[article.id] || false; // Use stored favorites if available
            return acc;
        }, {});
        
        setFavorites(updatedFavorites);

    } catch (err) {
        // @ts-ignore 
        setError(err.message);
    }
    setLoading(false);
};




  useFocusEffect(
    useCallback(() => {
      fetchFavorites(); // Fetch favorites from storage
    }, [])
  );

  const handleToggleFavorite = async (articleId: any, title: any, slug: any, content: any) => {
    const isFavorite = favorites[articleId];
    const serialisedContent = JSON.stringify(content);
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
        fetchFavorites(); // Immediately refetch favorites to ensure state is in sync
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

    return (
        <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
          >
            {articles.map((item) => (
              <View key={item.id.toString()} style={styles.item}>
                {/* @ts-ignore */}
                <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
                  <Image
                    style={styles.tinyLogo}
                    source={placeHolderImage}
                  /> 
                  <View>
                    <Text style={styles.title}>
                      {item.title.rendered} 
                    </Text>
                    <Text>Here's some bullshit to go with it...</Text>
                  </View>
                </Pressable>

                <Button
                  onPress={() => handleToggleFavorite(item.id, item.title.rendered, item.slug, item.content.rendered)}
                  title={favorites[item.id] ? '✓' : '-'}
                />
              </View>
            ))}
          </ScrollView>

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
