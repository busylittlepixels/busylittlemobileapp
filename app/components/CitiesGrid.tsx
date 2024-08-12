// @ts-nocheck
import React from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  View,
  Text, 
  Pressable,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const CitiesGrid = ({ cities }:any) => {


  const navigation = useNavigation(); // Get the navigation object

  const images = [
    { id: 1, url: 'https://via.placeholder.com/100/0000FF/808080' },
    { id: 2, url: 'https://via.placeholder.com/100/FF0000/FFFFFF' },
    { id: 3, url: 'https://via.placeholder.com/100/FFFF00/000000' }
  ];

  return (
    <FlatList
        data={cities}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
        <Pressable
            key={index}
            onPress={() => navigation.navigate('City', { city: item })}
            style={styles.imageContainer}
        >
            <Text>{item}</Text>
            <Image source={{ uri: images[index % images.length].url }} style={styles.image} />
        </Pressable>
        )}
    />
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
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default CitiesGrid;
