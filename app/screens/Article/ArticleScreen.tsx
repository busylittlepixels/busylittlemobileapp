import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Button, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSanitizeRender from '@/app/hooks/useSanitizeRender';
import { toggleFavorite as toggleFavoriteService } from '../../services/favouriteService';

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

    const title = item.title?.rendered || item.title;
    const content = item.content?.rendered || item.content;
    const sanitizedContent = useSanitizeRender(content);

    // Correctly fetch the featured media URL
    const featuredMedia = item?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

    useEffect(() => {
        setIsFavorite(favorites[articleId]);
    }, [favorites, articleId]);

    const handleToggleFavorite = async () => {
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
    }, [navigation, isFavorite]);

    const { width } = Dimensions.get('window');

    const renderers = {
        img: ({ src }:any) => <Image source={{ uri: src }} style={{ width: '100%', height: 200 }} />,
    };

    return (
        <View style={styles.container}>
            <ParallaxScrollView
                // @ts-ignore
                headerBackgroundColor="#353636"
                backgroundColor="#353636"
                contentBackgroundColor="#353636"
                // Pass the Image component itself as the value of headerImage
                headerImage={
                    <Image 
                        source={{ uri: featuredMedia || 'https://via.placeholder.com/600x400/808080/FFFFFF' }} 
                        style={styles.headerImage}
                    />
                }
            >
                <ThemedView style={{ flex: 1 }}>
                    <ThemedText type="title" style={{ color: '#fff' }}>{title}</ThemedText>
                </ThemedView>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: sanitizedContent }}
                    renderers={renderers}
                    // @ts-ignores
                    tagsStyles={baseStyles}  // <--- baseStyles is here
                    baseStyle={{ color: "#fff" }}
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
        width: '100%',
        height: 200, // Adjust height as needed
    },
    buttonContainer: {
        padding: 16,
    },
});
