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
import { useNavigation } from '@react-navigation/native';

const CitiesGrid = ({ cities }:any) => {


     const navigation = useNavigation(); // Get the navigation object


    const getCityImage = (name: string) => {
        switch (name.toLowerCase()) {
        case 'amsterdam':
            return require('../../assets/images/amsterdam.png');
        case 'dublin':
            return require('../../assets/images/dublin.png');
        case 'london':
            return require('../../assets/images/london.png');
        case 'hamburg':
            return require('../../assets/images/hamburg.png');
        case 'bogota':
            return require('../../assets/images/bogota.png');
        case 'new york':
            return require('../../assets/images/newyork.png');
        case 'copenhagen':
            return require('../../assets/images/copenhagen.png');
        // Add more cities as needed
        default:
            return require('../../assets/images/newyork.png'); // Fallback image
        }
    };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
    >
      {cities?.map((item, index) => (
        <Pressable
            key={index}
            onPress={() => navigation.navigate('City', { city: item })}
            style={styles.imageContainer}
        >
          

        <Image
            source={getCityImage(item)}
            style={styles.image}
        />
      
          <Text style={styles.imageText}>{item}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollView: {
      // Your scroll view styling here
    },
    imageContainer: {
      marginRight: 10, // Adjust spacing between items
      alignItems: 'center', // Center the content horizontally
      justifyContent: 'center', // Center the content vertically
      position: 'relative', // Enable absolute positioning for the text
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
      resizeMode: 'cover', // Ensure the image covers the area
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject, // Fills the image area
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black tint
        borderRadius: 10, // Match the image's border radius
    },
    imageText: {
      position: 'absolute', // Position the text over the image
      color: 'white', // Text color, assuming the image might be dark
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%', // Ensure the text spans the width of the image
    //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add a semi-transparent background for better text visibility
      paddingVertical: 4, // Add some vertical padding for readability
    },
});

export default CitiesGrid;
