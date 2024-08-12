// @ts-nocheck
import React from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  View,
  Pressable,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const HorizontalScroller = () => {
  const navigation = useNavigation(); // Get the navigation object

  const images = [
    { id: 1, url: 'https://via.placeholder.com/150/0000FF/808080' },
    { id: 2, url: 'https://via.placeholder.com/150/FF0000/FFFFFF' },
    { id: 3, url: 'https://via.placeholder.com/150/FFFF00/000000' },
    { id: 4, url: 'https://via.placeholder.com/150/00FF00/000000' },
    { id: 5, url: 'https://via.placeholder.com/150/FFA500/000000' },
    { id: 6, url: 'https://via.placeholder.com/150/800080/FFFFFF' },
  ];

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
    >
      {images.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => navigation.navigate('TabEile')}
          style={styles.imageContainer}
        >
          <Image source={{ uri: item.url }} style={styles.image} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // marginHorizontal: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default HorizontalScroller;
