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
  const [isFavorite, setIsFavorite] = useState(route.params?.isFavorite);
  const [favorites, setFavorites] = useState({});


  console.log('is it a favorite?', route.params?.isFavorite + ' ' + item.title);
  // Retrieve user information from the global state
  const user = useSelector((state) => state.auth.user);
  // Destructure relevant data from the article item
  const { title, content, id, slug } = item;

  // Normalize the title to ensure consistent rendering
  let normalizedTitle, normalizedContent;
  if (typeof item.title === 'string') {
    try {
      const parsedTitle = JSON.parse(item.title);
      normalizedTitle = parsedTitle ? parsedTitle.rendered : item.title;
    } catch (error) {
      // console.warn('Failed to parse title as JSON:', error);
      normalizedTitle = item.title;
    }
  } else if (typeof item.title === 'object' && item.title.rendered) {
    normalizedTitle = item.title.rendered;
  } else {
    normalizedTitle = item.title;
  }
  // Normalize the content to ensure consistent rendering
  if (typeof item.content === 'string') {
    try {
      const parsedContent = JSON.parse(item.content);
      normalizedContent = parsedContent.rendered ? parsedContent.rendered : item.content;
    } catch (error) {
      console.warn('Failed to parse content as JSON:', error);
      normalizedContent = item.content;
    }
  } else if (typeof item.content === 'object' && item.content.rendered) {
    normalizedContent = item.content.rendered;
  } else {
    normalizedContent = item.content;
  }

  // Load favorites from AsyncStorage when the component mounts
  const loadFavorites = async () => {
    try {
      // Fetch and set favorites
      const savedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

      setFavorites(parsedFavorites);

      // Check if the current article is a favorite and update the isFavorite state
      setIsFavorite(isFavorite);
    } catch (error) {
      console.error('Failed to load favorites', error);
    }
  };

  useEffect(() => {
    // Load favorites when the component mounts
    loadFavorites();
  }, []);

  // Handle toggling of favorites
  const handleToggleFavorite = async (articleId, title, slug, content) => {
    const serializedContent = typeof content === 'string' ? content : JSON.stringify(content);

    // Prepare the article data
    const articleData = {
      id: articleId,
      title: title,
      slug: slug,
      content: serializedContent
    };

    // Log the current state of favorites before the update
    console.log('Favorites before update:', favorites);
    console.log('Is article a favorite before toggle:', isFavorite);

    // Toggle the favorite status in the database
    const result = await toggleFavoriteService(user?.id, articleId, normalizedTitle, slug, serializedContent);

    if (result.error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Error', 
        text2: 'Failed to update favorites.' 
      });
      return;
    }

    // Update the local favorites state
    const updatedFavorites = { ...favorites };

    if (isFavorite) {
      delete updatedFavorites[articleId]; // Remove the favorite
    } else {
      updatedFavorites[articleId] = articleData; // Add the favorite
    }

    // Log the updated state of favorites after the update
    console.log('Favorites after update:', updatedFavorites);

    // Persist the updated favorites list
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.'
    });
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
