// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Pressable, Text, View, Button } from 'react-native';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const baseStyles = {
    body: {
      whiteSpace: 'normal',
      backgroundColor: '#fff',
      padding: 0
    }
};

export default function ArticleScreen({ navigation, route }: any) {
  const { item, isFavorite: initialFavorite } = route.params;
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [favorites, setFavorites] = useState({});  // Initialize the favorites state

  // Retrieve user information from the global state
  const user = useSelector((state) => state.auth.user);

  // Destructure relevant data from the article item
  const { title, content, id, slug } = route.params.item;

  // Normalize the title and content to ensure consistent rendering
  const normalizedTitle = title?.rendered || title;
  const normalizedContent = content?.rendered || JSON.parse(content);

  // Load the favorites from AsyncStorage when the component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        setIsFavorite(!!parsedFavorites[id]);  // Set initial favorite status based on storage
      }
    };

    loadFavorites();
  }, [id, user?.id]);

  // Handle the toggling of the favorite status
  const handleToggleFavorite = async (articleId, title, slug, content) => {
    const isFavorite = favorites[articleId];
    const serializedContent = JSON.stringify(content);

    // Create an object that includes all necessary article properties
    const articleData = {
        id: articleId,
        title: title,
        slug: slug,
        content: serializedContent
    };

    const result = await toggleFavoriteService(user?.id, articleId, title, slug, serializedContent);

    if (result.error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
    } else {
        // If article is already favorited, remove it; otherwise, add it
        const updatedFavorites = {
            ...favorites,
            [articleId]: !isFavorite ? articleData : undefined  // Store the article data instead of just `true`
        };

        // Remove undefined values (articles that have been unfavorited)
        const cleanedFavorites = Object.fromEntries(
            Object.entries(updatedFavorites).filter(([key, value]) => value !== undefined)
        );

        setFavorites(cleanedFavorites);
        await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(cleanedFavorites));
        setIsFavorite(!isFavorite);

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.'
        });
    }
  };

  // Update the header options when the component mounts or when the favorite status changes
  useEffect(() => {
    navigation.setOptions({
      title: normalizedTitle,
      headerRight: () => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable
            onPress={() => handleToggleFavorite(id, title, slug, content)}
            style={{ marginRight: 15 }}
          >
            <Ionicons
              name={isFavorite ? 'checkmark-circle-outline' : 'remove-outline'}
              size={24}
              color={isFavorite ? 'green' : 'gray'}
            />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, isFavorite]);

  // Get the width of the screen for rendering the article content
  const { width } = Dimensions.get('window');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{normalizedTitle}</ThemedText>
      </ThemedView>
      <RenderHTML
        contentWidth={width}
        source={{ html: normalizedContent }}
        tagsStyles={baseStyles}
        style={{ paddingHorizontal: 0, color: "white" }}
      />
      <View>
        <Button title="Back to Articles" onPress={() => navigation.navigate('Account')} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    color: '#ffffff'
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
});

