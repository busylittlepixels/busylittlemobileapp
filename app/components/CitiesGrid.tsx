import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (cities && cities.length > 0) {
      setIsLoading(false); // Stop loading once cities data is available
    } else {
      setIsLoading(true); // Start loading if cities is empty or undefined
    }
  }, [cities]);

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
        return require('../../assets/images/klingons.png'); // Fallback image
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={styles.loading}>
  //       <ActivityIndicator size="small" />
  //       <Text style={{ color: '#000'}}>Loading cities...</Text>
  //     </View>
  //   );
  // }

  if (!cities || cities.length === 0) {
    return (
      <View style={styles.noCities}>
        <Text style={{ color: '#000', fontSize: 12 }}>You have no cities selected.</Text>
      </View>
    );
  }

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
        {cities.map((item:any, index:any) => (
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
        ))}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  noCities: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCitiesText: {
    fontSize: 18,
    color: 'gray',
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
