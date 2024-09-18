// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, Image, Platform, Pressable, Text, View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import InScreenScroller from '@/app/components/InScreenScroller';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import EventSignupForm from '../../components/EventSignupForm';
import Animated, { withSpring, useSharedValue, SharedTransition } from 'react-native-reanimated';
import React from 'react';

const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

export default function EventScreen({ navigation, route }: any) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
// Extract event_image from route params
const evntImg = route.params?.item?.event_image;

// This function will return the correct image source based on whether it's a URL or a local asset
const getEvntImage = (imagePath: string) => {
  if (imagePath && imagePath.startsWith('http')) {
    // It's a URL, return the uri object
    return { uri: imagePath };
  } else {
    // It's a local resource, use require
    return require('../../assets/images/tile.png'); // Fallback image if necessary
  }
};

const eImg = getEvntImage(evntImg);

console.log('fucking imagee', eImg.uri)

  useEffect(() => {
    navigation.setOptions({ title: route.params.item.event_name });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
        backgroundColor="#353636" // Set the background color of the scroll view itself
        contentBackgroundColor="#353636" // Set the content background colorz
        headerImage={<Animated.Image source={{ uri: eImg.uri }} style={{ width: 400, height: 250,}} sharedTransitionStyle={customTransition} sharedTransitionTag={`city-${route.params?.city}`}  />}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{route.params ? route.params.item.event_name : 'Title'}</ThemedText>
        </ThemedView>
        <ThemedText>
          {route.params ? route.params.item.description : 'Body'}
        </ThemedText>

        <ThemedText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id enim nec libero pulvinar luctus ac at urna. Cras consequat tortor vitae porttitor aliquet. Maecenas in ornare sapien.
        </ThemedText>
        <ThemedText>
          Fusce ullamcorper, augue quis lacinia molestie, lorem orci vulputate augue, ac accumsan turpis tellus vitae orci. Donec ornare ullamcorper viverra. Duis in semper dui, ut tempor mauris.
          </ThemedText>
          <ThemedText>
           Maecenas pellentesque vehicula nibh vel scelerisque. Fusce sollicitudin sodales lectus, sit amet feugiat justo pharetra nec. Phasellus non lacinia urna, nec dignissim velit. Quisque consequat nisi a fringilla pulvinar.
        </ThemedText>
        
        <View style={{ paddingVertical: 10 }}>
          <InScreenScroller />
        </View>

        <ThemedText>
          Video
        </ThemedText>

        <EventSignupForm user={user} hostcity={route.params ? route.params.item?.city : 'dublin'} />

        <View>
          <Button title="Back to List" onPress={() => navigation.navigate('Account')} />
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    // color: '#808080',
    // bottom: -90,
    // left: -35,
    // position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    color: '#ffffff',
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
});
