// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, Image, Platform, Pressable, Text, View, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import EventSignupForm from '../../components/EventSignupForm';
import React from 'react';

export default function EventScreen({ navigation, route }: any) {
  const dispatch = useDispatch();

  console.log('eventscreen', route.params)
  // Access the user from Redux state
  // @ts-ignore
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    navigation.setOptions({ title: route.params.item.event_name });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ParallaxScrollView
          headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
          backgroundColor="#353636"
          contentBackgroundColor="#353636"
          headerImage={
            <Image 
              source={{ uri: route.params.item.event_image || 'https://via.placeholder.com/600x400/808080/FFFFFF' }} 
              style={styles.headerImage}
            />
          }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{route.params ? route.params.item.event_name : 'Title'}</ThemedText>
        </ThemedView>
        <ThemedText>
          {route.params ? route.params.item.description : 'Body'}
        </ThemedText>

        <ThemedText>
         Features
        </ThemedText>

        <ThemedText>
          Carousel to ImageGrid
        </ThemedText>

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
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
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
