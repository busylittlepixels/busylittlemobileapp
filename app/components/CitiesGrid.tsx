import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  View,
  Text, 
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CitiesGrid = ({ cities }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollView,
          !isLoading && { justifyContent: 'flex-start' }, // Ensure content alignment when not loading
        ]}
      >
        {cities ? cities?.map((item:any, index:any) => (
          <Pressable
            key={index}
            // @ts-ignore
            onPress={() => navigation.navigate('City', { city: item })}
            style={styles.imageContainer}
          >
            <Image
              source={getCityImage(item)}
              style={styles.image}
            />
            <Text style={styles.imageText}>{item}</Text>
          </Pressable>
        )) : 
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1, // Ensures it takes up the full available space
    justifyContent: 'flex-start', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
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
  imageText: {
    position: 'absolute', // Position the text over the image
    color: 'white', // Text color, assuming the image might be dark
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%', // Ensure the text spans the width of the image
    paddingVertical: 4, // Add some vertical padding for readability
  },
});


export default CitiesGrid;
