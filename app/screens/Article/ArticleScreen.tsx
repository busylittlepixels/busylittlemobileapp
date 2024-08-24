// @ts-nocheck
import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Button, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import { toggleFavorite } from '../../actions/favoriteActions';
import useSanitizeRender from '@/app/hooks/useSanitizeRender';

const baseStyles = {
    body: {
        whiteSpace: 'normal',
        // backgroundColor: '#000',
        padding: 0,
        color: '#fff', // Ensure text is black
    },
    p: {
        margin: 0,
        padding: 0,
    },
    a: {
        color: '#007bff', // Custom color for links
        textDecorationLine: 'underline',
    },
};

export default function ArticleScreen({ navigation, route }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const favorites = useSelector((state: any) => state.favorite.favorites);
    
    const { item, isFavorite } = route.params;
    const { id, article_id } = item;
    console.log('is this a fave?', isFavorite);
    // Extract and normalize title and content
    const title = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;
    const content = typeof item.content === 'object' && item.content.rendered ? item.content.rendered : item.content;

    const sanitizedContent = useSanitizeRender(content);

    const handleToggleFavorite = () => {
        console.log('toggled on ArticleScreen')
        dispatch(toggleFavorite(user.id, item));
        console.log('toggled on ArticleScreen')
    };

    useEffect(() => {
        console.log('is fave?', isFavorite)
        navigation.setOptions({
            title: title,
            headerRight: () => (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Pressable
                        onPress={handleToggleFavorite}
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

    const { width } = Dimensions.get('window');

    const renderers = {
        img: ({ src }) => (
            <Image source={{ uri: src }} style={{ width: '100%', height: 200 }} />
        )
    };

    return (
        <View style={styles.container}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
                backgroundColor="#353636" // Set the background color of the scroll view itself
                contentBackgroundColor="#353636" // Set the content background color
                headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
            >
                <ThemedView style={{ flex: 1 }}>
                    <ThemedText type="title" style={{ color: '#fff' }}>{title}</ThemedText>
                </ThemedView>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: sanitizedContent }}
                    renderers={renderers}
                    tagsStyles={baseStyles}  // Custom styling for HTML content
                    baseStyle={{ color: "#000" }} // Ensure background is white and text is black
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
        // backgroundColor: '#000', // Ensure the container has a white background
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        // position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        padding: 16,
        backgroundColor: '#000', // Ensure this container has a white background
    },
    buttonContainer: {
        padding: 16,
    }
});

export default ArticleScreen;
