import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Pressable, Image, StyleSheet, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ArticleItem = ({ item, isFavorite, onToggleFavorite }:any) => {
    const navigation = useNavigation(); 

    return(
        <View key={item.id} style={styles.item}>
        {/* @ts-ignore */}
        <Pressable onPress={() => navigation.navigate('Article', { item, isFavorite: true })} style={styles.articlePressable}>
            <Image style={styles.tinyLogo} source={{ uri: 'https://via.placeholder.com/50/800080/FFFFFF' }} />
            <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item.title.rendered}
            </Text>
            <Text style={styles.description}>Here's some description...</Text>
            </View>
        </Pressable>
        <Pressable
            onPress={() => onToggleFavorite(item.id, item.title?.rendered, item.slug, item.content?.rendered)}
            style={styles.favoriteButton}
        >
            <Ionicons
            name={isFavorite ? 'checkmark-circle-outline' : 'remove-outline'}
            size={24}
            color={isFavorite ? 'green' : 'gray'}
            />
        </Pressable>
        </View>
    ); 
};

const styles = StyleSheet.create({
    favoriteButton:{},
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    articlePressable: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tinyLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    title: {
    fontWeight: 'bold',
        fontSize: 16,
        maxWidth: '100%',
    },
    description: {
        fontSize: 14,
        color: '#666',
    }
}); 

export default ArticleItem; 