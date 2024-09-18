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
import Animated, { withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SharedTransition } from 'react-native-reanimated';

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

// Replace 'cities' with dummy data containing placeholder images
const dummyData = ['Image 1', 'Image 2', 'Image 3', 'Image 4', 'Image 5', 'Image 6'];

const InScreenScroller = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    if (dummyData && dummyData.length > 0) {
      setIsLoading(false); // Stop loading once dummy data is available
    } else {
      setIsLoading(true); // Start loading if no data is present
    }
  }, []);

  const getPlaceholderImage = () => {
    return require('./../assets/images/tile.png'); // Default placeholder image
  };

  if (!dummyData || dummyData.length === 0) {
    return (
      <View style={styles.noCities}>
        <Text style={{ color: '#000', fontSize: 12 }}>You have no content available.</Text>
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
        {dummyData.map((item, index) => (
          <Pressable
            key={index}
            // @ts-ignore
            onPress={() => navigation.navigate('City', { city: item })}
            style={styles.imageContainer}
          >
            <Animated.Image
              source={getPlaceholderImage()} // Using placeholder image for all items
              style={{ width: 100, height: 100, borderRadius: 10 }}
              sharedTransitionTag={`city-${item}`}
              sharedTransitionStyle={customTransition}
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
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  noCities: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imageText: {
    position: 'absolute',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 4,
  },
});

export default InScreenScroller;
