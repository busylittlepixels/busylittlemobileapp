// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Pressable, Text, View, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';


// Base styles for the rendered HTML content
const baseStyles = {
  body: {
    whiteSpace: 'normal',
    backgroundColor: '#fff',
    padding: 0,
  },
};

export default function ArticleScreen({ navigation, route }: any) {
  // Destructure relevant props and route parameters
  const { item, isFavorite: initialFavorite } = route.params;

  route.params.isFavorite ?
  console.log('is favorite Article Screen Ln: 29', route.params?.isFavorite + ' ' + item.id)
  :
  console.log('is not a favorite Article Screen Ln: 31', route.params?.isFavorite)
 

  const { title, content, id, slug, article_id } = item;

  console.log('ARTICLE SCREEN ITEM ID (LN:29):', item.id ? item.id : 'no item id? wtf?');
  console.log('ARTICLE SCREEN ARTICLE_ID(LN:30)', isFavorite);
  // State to manage favorites
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [favorites, setFavorites] = useState({});

  // Retrieve user information from the global state
  const user = useSelector((state) => state.auth.user);

  // Normalize the title and content to ensure consistent rendering
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

  // Effect hook to load favorites from AsyncStorage when the component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
        const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
  
        setFavorites(parsedFavorites);
        console.log(`ARTICLE SCREEN (LN: 77) isFavorite defined ${item.id}:`, isFavorite ? 'yarp':'fuck no');
  
        setIsFavorite(!!parsedFavorites[id]);
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };
  
    loadFavorites();
  }, [route.params?.isFavorite, item.title?.rendered]);
  

  // Effect hook to update the header options based on the favorite status
  
  useEffect(() => {
    if (typeof isFavorite !== 'undefined') {
      console.log('in UE, ArticleScreen, is favorite?', isFavorite);
      console.log('in UE, ArticleScreen, article_id:', article_id ); 
      navigation.setOptions({
        title: normalizedTitle,
        headerRight: () => (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Pressable
              onPress={() => handleToggleFavorite(user.id, article_id, title, slug, content)}
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
    }
  }, [navigation, isFavorite]);
  

  // Function to handle toggling of favorites
  // const handleToggleFavorite = async (userId, articleId, title, slug, content) => {

  //   console.log('toggle', articleId)
  //   const serializedContent = typeof content === 'string' ? content : JSON.stringify(content);

  //   // Prepare the article data
  //   const articleData = {
  //     id: userId,
  //     article_id: articleId,
  //     title: title,
  //     slug: slug,
  //     content: serializedContent,
  //   };

  //   // Log the current state of favorites before the update
  //   console.log('Favorites before update:', favorites);
  //   console.log('Is article a favorite before toggle:', isFavorite);
  //   console.log('normalisedTitle', normalizedTitle);
  //   // Toggle the favorite status in the database
  //   const result = await toggleFavoriteService(userId, articleId, normalizedTitle, slug, serializedContent);

  //   if (result.error) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'Failed to update favorites.',
  //     });
  //     return;
  //   }

  //   // Update the local favorites state
  //   const updatedFavorites = { ...favorites };

  //   if (isFavorite) {
  //     delete updatedFavorites[articleId]; // Remove the favorite
  //   } else {
  //     updatedFavorites[articleId] = articleData; // Add the favorite
  //   }

  //   // Log the updated state of favorites after the update
  //   console.log('Favorites after update:', updatedFavorites);

  //   // Persist the updated favorites list
  //   setFavorites(updatedFavorites);
  //   await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
  //   setIsFavorite(!isFavorite);

  //   Toast.show({
  //     type: 'success',
  //     text1: 'Success',
  //     text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.',
  //   });
  // };

  const handleToggleFavorite = async (userId, articleId, title, slug, content) => {
   
    const isFavorite = favorites[articleId];
    const serializedContent = JSON.stringify(content);
    const result = await toggleFavoriteService(articleId, title, slug, serializedContent);

    console.log('toggled!', articleId, title, slug )

    if (result.error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
    } else {
      const updatedFavorites = { ...favorites, [articleId]: !isFavorite };
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
      Toast.show({ type: 'success', text1: 'Success', text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.' });
    }
  };

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
    color: '#ffffff',
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
});

