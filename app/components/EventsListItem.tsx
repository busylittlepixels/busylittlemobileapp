// components/NewsItem.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const EventListItem = ({ title, image, link, excerpt }:any) => {
  return (
    <Pressable style={styles.container} onPress={() => Linking.openURL(link)}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.excerpt}>{excerpt}</Text>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: width - 20, // Full width minus padding
    alignSelf: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  excerpt: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventListItem;
