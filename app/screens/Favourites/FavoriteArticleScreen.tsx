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

const normalizeContent = (input: any) => {
    if (input && typeof input === 'object' && input.rendered) {
        return input.rendered;
    }
    return input || ''; // Fallback to an empty string if input is undefined or null
};

export default function FavoriteArticleScreen({ navigation, route }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const favorites = useSelector((state: any) => state.favorite.favorites);

    const { item } = route.params;
    const { id, article_id } = item;

    const title = typeof item.title === 'object' && item.title.rendered ? item.title.rendered : item.title;
    const content = typeof item.content === 'object' && item.content.rendered ? item.content.rendered : item.content;

    const isFavorite = !!favorites[article_id];


    const handleToggleFavorite = () => {
        dispatch(toggleFavorite(user.id, { ...item, title, content }));
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
                source={{ html: JSON.parse(content) }}
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
