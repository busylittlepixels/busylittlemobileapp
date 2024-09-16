import React, { useEffect, useState, memo, useCallback } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Button, Image, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSanitizeRender from '@/app/hooks/useSanitizeRender';
import { toggleFavorite } from '../../services/favouriteService';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


const MemoizedRenderHTML = memo(RenderHTML, (prevProps, nextProps) => {
    // @ts-ignore
    return prevProps.source.html === nextProps.source.html;
  });

const baseStyles = {
  body: {
    whiteSpace: 'normal',
    padding: 0,
    color: '#fff',
  },
  p: {
    margin: 0,
    padding: 0,
  },
  a: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
};

export default function ArticleScreen({ navigation, route }: any) {
  const opacityValue = useSharedValue(0); // Updated
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const favorites = useSelector((state: any) => state.favorite.favorites);

  const { item, isFavorite: initialIsFavorite } = route.params;
  const { id, article_id } = item;
  const articleId = article_id || id;

  const title = item.title?.rendered || item.title;
  const content = item.content?.rendered || item.content;
  const [sanitizedContent, setSanitizedContent] = useState<string | null>(null);
  const featuredMedia = item?._embedded?.['wp:featuredmedia']?.[0]?.source_url || route.params.featuredMedia;

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const sanitizeContent = useSanitizeRender(content);

  // Function to fade in the component
  const fadeIn = () => {
    opacityValue.value = withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) });
  };

  // Apply animation to style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
    };
  });

  useEffect(() => {
    const fetchSanitizedContent = async () => {
      try {
        const sanitized = await sanitizeContent;
        setSanitizedContent(sanitized);
      } catch (error) {
        // @ts-ignore
        if (error.message.includes("Unrecognized token '<'")) {
          console.log("Suppressing known HTML parsing error.");
        } else {
          // console.error('Error sanitizing content:', error);
        }
        setSanitizedContent(null);
      }
    };
  
    fetchSanitizedContent();
  }, [content, sanitizeContent]);

  useEffect(() => {
    setIsFavorite(favorites[articleId]);
  }, [favorites, articleId]);

  useEffect(() => {
    // Trigger fade in animation when the component mounts
    fadeIn();
  }, []); // Runs once on mount

  const handleToggleFavorite = useCallback(async () => {
    try {
      const result = await toggleFavorite(
        user?.id,
        articleId,
        title,
        item.slug,
        content,
        featuredMedia
      );

      if (result.error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
      } else {
        const updatedFavorites = { ...favorites, [articleId]: !isFavorite };

        dispatch({
          type: 'UPDATE_FAVORITES',
          payload: updatedFavorites,
        });

        await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));

        setIsFavorite(!isFavorite);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
    }
  }, [user?.id, articleId, title, item.slug, content, featuredMedia, favorites, isFavorite, dispatch]);

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerRight: () => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Pressable onPress={handleToggleFavorite} style={{ marginRight: 15 }}>
            <Ionicons
              name={isFavorite ? 'checkmark-circle-outline' : 'remove-circle-outline'}
              size={24}
              color={isFavorite ? 'green' : 'gray'}
            />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, isFavorite, title, handleToggleFavorite]);

  const { width } = Dimensions.get('window');

  const renderers = {
    img: ({ src }: any) => <Image source={{ uri: src }} style={{ width: '100%', height: 200 }} resizeMode="cover" />,
  };

  const renderContent = useCallback(() => {
    if (sanitizedContent === null) {
      // @ts-ignore
      return <ThemedText type="body" style={styles.unavailableText}>Content unavailable.</ThemedText>;
    }

    try {
      return (
        <MemoizedRenderHTML
          contentWidth={width}
          source={{ html: sanitizedContent }}
          renderers={renderers}
          // @ts-ignore
          tagsStyles={baseStyles}
          baseStyle={{ color: "#fff" }}
        />
      );
    } catch (error) {
      console.error('Error rendering HTML:', error);
      // @ts-ignore
      return <ThemedText type="body" style={styles.unavailableText}>Error rendering content.</ThemedText>;
    }
  }, [sanitizedContent, width]);

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        // @ts-ignores
        headerBackgroundColor="#353636"
        backgroundColor="#353636"
        contentBackgroundColor="#353636"
        headerImage={
          <Image 
            source={{ uri: featuredMedia || 'https://via.placeholder.com/600x400/808080/FFFFFF' }} 
            style={styles.headerImage}
          />
        }
      >
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <ThemedText type="title" style={styles.title}>{title}</ThemedText>
          <ScrollView>
            {renderContent()}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button title="Back to Articles" onPress={() => navigation.navigate('Account')} />
          </View>
        </Animated.View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  unavailableText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
