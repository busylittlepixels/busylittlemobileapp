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


const EventsGrid = ({ items }:any) => {


  const navigation = useNavigation(); // Get the navigation object

  return (
    <ScrollView
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.eventsSection}
    >
      {items.map((item) => (
        <Pressable
        // @ts-ignore
        onPress={() => navigation.navigate('Event', { item })}
        style={styles.articlePressable}
      >
        {/* Use the featuredMedia as the image source */}
        <Image
          style={styles.tinyLogo}
          source={{
            uri: item.event_image ? item.event_image : 'https://via.placeholder.com/50/800080/FFFFFF',
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.event_name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  eventsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#'
  },
  eventsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventsSection: {
    backgroundColor: '#ffffff',
    padding: 0,
  },
  eventButton: {
    marginLeft: 10, 
    border: 1, 
    borderRadius: 5, 
    backgroundColor: 'green', 
    padding: 10,
  }, 
  eventButtonText: {
    color: '#fff'
  },
  articlePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 5
  },
  tinyLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: '100%',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventsGrid;
