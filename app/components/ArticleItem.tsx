import React from 'react';
import { View, Pressable, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ArticleItem = ({ item, isFavorite, onToggleFavorite, featuredMedia }:any) => {
  const navigation = useNavigation();

  return (
    <View key={item.id} style={styles.item}>
      {/* Navigate to ArticleScreen */}
      <Pressable
        // @ts-ignore
        onPress={() => navigation.navigate('Article', { item, isFavorite, featuredMedia })}
        style={styles.articlePressable}
      >
        {/* Use the featuredMedia as the image source */}
        <Image
          style={styles.tinyLogo}
          source={{
            uri: featuredMedia ? featuredMedia : 'https://via.placeholder.com/50/800080/FFFFFF',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title?.rendered || item.title}
          </Text>
        </View>
      </Pressable>

      {/* Favorite button */}
      <Pressable
        onPress={() => onToggleFavorite(item.id, item.title?.rendered, item.slug, item.content?.rendered, featuredMedia)}
        style={styles.favoriteButton}
      >
        <Ionicons
          // @ts-ignore
          name={isFavorite ? 'heart' : null}
          size={18}
          color={isFavorite && 'red'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {},
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
    borderRadius: 5,
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
  },
});

export default ArticleItem;
