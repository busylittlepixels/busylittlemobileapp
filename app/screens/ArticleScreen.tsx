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
      color: '#000',
      padding: 0
    }
};

export default function ArticleScreen({ navigation, route }: any) {
  const { item, isFavorite: initialFavorite } = route.params;
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // Retrieve user information from the global state
  const user = useSelector((state) => state.auth.user);

  // Destructure relevant data from the article item
  const { title, content, id, slug } = route.params.item;

  // Normalize the title and content to ensure consistent rendering
  const normalizedTitle = title?.rendered || title;
  const normalizedContent = content?.rendered || JSON.parse(content);

  // Handle the toggling of the favorite status
  const handleToggleFavorite = async (articleId: string) => {
    try {
      // Retrieve the current favorites from AsyncStorage
      const storedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};

      // Determine the current favorite status and toggle it
      const isCurrentlyFavorite = favorites[articleId];
      const updatedFavoriteStatus = !isCurrentlyFavorite;

      // Update the favorites object with the new status
      const updatedFavorites = { ...favorites, [articleId]: updatedFavoriteStatus };

      // Persist the updated favorites back to AsyncStorage
      await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));

      // Update the local state to reflect the change
      setIsFavorite(updatedFavoriteStatus);

      // Optionally, show a Toast message indicating the result
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: updatedFavoriteStatus ? 'Added to favorites.' : 'Removed from favorites.',
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Failed to toggle favorite', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
    }
  };

  // Update the header options when the component mounts or when the favorite status changes
  useEffect(() => {
    navigation.setOptions({
      title: normalizedTitle,
      headerRight: () => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable
            onPress={() => handleToggleFavorite(id)}
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
        {/* <Text style={{ color: '#000'}}>{isFavorite ? 'yep' : 'nope'}</Text> */}
      </ThemedView>
      <RenderHTML
        contentWidth={width}
        source={{ html: normalizedContent }}
        tagsStyles={baseStyles}
        style={{ paddingHorizontal: 0 }}
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
