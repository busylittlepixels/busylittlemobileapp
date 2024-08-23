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

const baseStyles = {
    body: {
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        padding: 0,
    },
};

export default function ArticleScreen({ navigation, route }: any) {

    const { item, isFavorite: initialFavorite } = route.params;
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    
    console.log('Initial isFavorite:', initialFavorite);

    const { title, content, id, slug, article_id } = item;
    const [favorites, setFavorites] = useState({});
    // @ts-ignore
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        console.log('useEffect 1: Initial mount', { initialFavorite, isFavorite });
    
        const loadFavorites = async () => {
            try {
                const savedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
                const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
    
                console.log('Favorites loaded:', parsedFavorites);
                setFavorites(parsedFavorites);
                setIsFavorite(!!parsedFavorites[id]);
                console.log('useEffect 1: After setting favorites', { isFavorite });
            } catch (error) {
                console.error('Failed to load favorites', error);
            }
        };
    
        loadFavorites();
    }, [route.params?.isFavorite, item.title?.rendered]);

    let normalizedTitle, normalizedContent;

    // Normalize title
    if (typeof item.title === 'string') {
        try {
            const parsedTitle = JSON.parse(item.title);
            normalizedTitle = parsedTitle.rendered ? parsedTitle.rendered : item.title;
        } catch (error) {
            normalizedTitle = item.title;
        }
    } else if (typeof item.title === 'object' && item.title.rendered) {
        normalizedTitle = item.title.rendered;
    } else {
        normalizedTitle = item.title;
    }

    // Normalize content
    if (typeof item.content === 'string') {
        try {
            const parsedContent = JSON.parse(item.content);
            normalizedContent = parsedContent.rendered ? parsedContent.rendered : item.content;
        } catch (error) {
            normalizedContent = item.content;
        }
    } else if (typeof item.content === 'object' && item.content.rendered) {
        normalizedContent = item.content.rendered;
    } else {
        normalizedContent = item.content;
    }

    // Ensure normalizedContent is defined and a string before using .replace
    if (typeof normalizedContent === 'string') {
        normalizedContent = normalizedContent
          .replace(/\\n/g, '\n')
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\u002F/g, '/');
      }


    try {
        if (typeof item.content === 'string') {
            const parsedContent = JSON.parse(item.content);
            normalizedContent = parsedContent.rendered ? parsedContent.rendered : item.content;
        }
    } catch (error) {
        console.warn('Failed to parse content:', error);
    }

    // Replace escaped characters if necessary
    normalizedContent = normalizedContent.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\"/g, '"');

    // Handle escaped URLs
    normalizedContent = normalizedContent.replace(/\\u002F/g, '/');

    console.log('Normalized Title (article screen):', normalizedTitle + ' ' + user.id + ' Is favorite?' + ' ' + isFavorite);
    // console.log('Normalized Content:', normalizedContent);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const savedFavorites = await AsyncStorage.getItem(`favorites_${user?.id}`);
                const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};

                setFavorites(parsedFavorites);
                setIsFavorite(!!parsedFavorites[id]);
            } catch (error) {
                console.error('Failed to load favorites', error);
            }
        };

        loadFavorites();
    }, [route.params?.isFavorite, item.title?.rendered]);

    useEffect(() => {
        if (typeof isFavorite !== 'undefined') {
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

    const handleToggleFavorite = async (userId: any, articleId: string | number, title: any, slug: any, content: any) => {
        // @ts-ignore
        const isFavorite = favorites[articleId];
        const serializedContent = JSON.stringify(content);
        const result = await toggleFavoriteService(userId, articleId, title, slug, serializedContent);

        if (result.error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
        } else {
            const updatedFavorites = { ...favorites, [articleId]: !isFavorite };
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
            setIsFavorite(!isFavorite);
            Toast.show({ type: 'success', text1: 'Success', text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.' });
        }
    };

    useEffect(() => {
        console.log('Updated isFavorite in useEffect:', isFavorite);
    }, [isFavorite])

    const { width } = Dimensions.get('window');
    // console.log('Before rendering:', { title: normalizedTitle, content: normalizedContent });
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
                // @ts-ignore
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
