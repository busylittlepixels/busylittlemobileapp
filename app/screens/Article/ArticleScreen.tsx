// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Button, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import { toggleFavorite as toggleFavoriteService } from '../../services/favouriteService';
import useSanitizeRender from '@/app/hooks/useSanitizeRender';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const favorites = useSelector((state: any) => state.favorite.favorites);

    const { item, isFavorite: initialIsFavorite } = route.params;
    const { id, article_id } = item;
    const articleId = article_id || id;

    // Handle both title and content rendered data
    const title = item.title?.rendered || item.title;
    const content = item.content?.rendered || item.content;
    const sanitizedContent = useSanitizeRender(content);

    // Local state to track whether the article is a favorite
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    // Update local state when Redux favorites change
    useEffect(() => {
        setIsFavorite(favorites[articleId]);
    }, [favorites, articleId]);

    const handleToggleFavorite = async () => {
        if (!articleId) {
            console.error('Error: article_id or id is missing');
            return;
        }

        const serializedContent = JSON.stringify(item.content?.rendered || item.content);

        try {
            const result = await toggleFavoriteService(user?.id, articleId, item.title, item.slug, serializedContent);

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
    };

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
    }, [navigation, isFavorite]); // Re-run the effect whenever `isFavorite` changes

    const { width } = Dimensions.get('window');

    const renderers = {
        img: ({ src }) => <Image source={{ uri: src }} style={{ width: '100%', height: 200 }} />,
    };

    return (
        <View style={styles.container}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
                backgroundColor="#353636"
                contentBackgroundColor="#353636"
                headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
            >
                <ThemedView style={{ flex: 1 }}>
                    <ThemedText type="title" style={{ color: '#fff' }}>{title}</ThemedText>
                </ThemedView>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: sanitizedContent }}
                    renderers={renderers}
                    tagsStyles={baseStyles}
                    baseStyle={{ color: "#000" }}
                />
                <View style={styles.buttonContainer}>
                    <Button title="Back to Articles" onPress={() => navigation.navigate('Account')} />
                </View>
            </ParallaxScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
    },
    buttonContainer: {
        padding: 16,
    },
});
