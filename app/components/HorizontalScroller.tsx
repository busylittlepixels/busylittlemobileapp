// @ts-nocheck
import React, { useRef } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  Pressable,
  Animated,
  Dimensions,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const HorizontalScroller = () => {
  const navigation = useNavigation(); // Get the navigation object
  const scrollX = useRef(new Animated.Value(0)).current; // Scroll position

  const images = [
    { id: 1, url: require('../../assets/images/marathon1.png') },
    { id: 2, url: require('../../assets/images/marathon2.png') },
    { id: 3, url: require('../../assets/images/marathon3.png') },
    { id: 4, url: require('../../assets/images/marathon4.png') },
    { id: 5, url: require('../../assets/images/marathon5.png') },
    { id: 6, url: require('../../assets/images/marathon6.png') },
  ];

  return (
    <Animated.ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={4}
    >
      {images.map((item, index) => {
        const inputRange = [
          (index - 1) * (screenWidth * 0.6),
          index * (screenWidth * 0.6),
          (index + 1) * (screenWidth * 0.6),
        ];

        const translateX = scrollX.interpolate({
          inputRange,
          outputRange: [-10, 0, 10], // Subtle horizontal movement for parallax
          extrapolate: 'clamp',
        });

        return (
          <Pressable
            key={item.id}
            onPress={() => navigation.navigate('TabEile')}
            style={styles.imageContainer}
          >
            <View style={styles.innerContainer}>
              <Animated.Image
                source={typeof item.url === 'string' ? { uri: item.url } : item.url}
                style={[styles.image, { transform: [{ translateX }] }]}
                resizeMode="cover"
              />
            </View>
          </Pressable>
        );
      })}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // paddingHorizontal: 10,
  },
  imageContainer: {
    marginRight: 10,
    overflow: 'hidden', // Ensure that the image movement stays within bounds
    width: 200, // Container width should match the intended image width
    height: 200, // Container height should match the intended image height
    borderRadius: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'flex-start', // Align items to the top
    justifyContent: 'flex-start', // Start items from the left
  },
  image: {
    width: 220, // Slightly larger than the container to allow the parallax effect
    height: 200, // Keep the height the same as the container
    borderRadius: 10,
  },
});

export default HorizontalScroller;
