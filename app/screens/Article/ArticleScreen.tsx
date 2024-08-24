// @ts-nocheck
import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Pressable, View, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';
import { toggleFavorite } from '../../actions/favoriteActions';
import { decode } from 'html-entities'; // Import the html-entities package

const baseStyles = {
    body: {
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        padding: 0,
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

    console.log('article, is favorite?', route.params.isFavorite);
    
    // Extract and normalize title and content
    const title = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;
    const content = typeof item.content === 'object' && item.content.rendered ? item.content.rendered : item.content;

    // Decode and sanitize content
    const decodedContent = decode(content).replace(/\\n/g, '<br/>').replace(/\\'/g, "'");

    const handleToggleFavorite = () => {
        dispatch(toggleFavorite(user.id, item));
    };

    useEffect(() => {
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
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{title}</ThemedText>
            </ThemedView>
            <RenderHTML
                contentWidth={width}
                source={{ html: decodedContent }}
                tagsStyles={baseStyles}  // Custom styling for HTML content
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
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    link: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    faveLinks: {
        color: 'black',
        paddingTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    noCont: {
        color: '#000',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: 'black',
    },
});
