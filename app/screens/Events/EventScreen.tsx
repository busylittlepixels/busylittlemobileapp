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

  // Access the user from Redux state
  // @ts-ignore
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    navigation.setOptions({ title: route.params.item.event_name });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{route.params ? route.params.item.event_name : 'Title'}</ThemedText>
        </ThemedView>
        <ThemedText>
          {route.params ? route.params.item.event_description : 'Body'}
        </ThemedText>

        <EventSignupForm user={user}/>

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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#333', // Example background color
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
