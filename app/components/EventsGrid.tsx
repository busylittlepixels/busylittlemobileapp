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


const EventsGrid = ({ tickets }:any) => {


  const navigation = useNavigation(); // Get the navigation object

  return (
    <ScrollView
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.eventsSection}
    >
      {tickets.map((item) => (
        <View key={item.id} style={styles.item}>
          <View>
            <Text style={styles.title}>{item.event_name}</Text>
            <Text>{item.event_description}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Event', { item })}
            style={styles.eventButton}
          >
            <Text style={styles.eventButtonText}>View Event</Text>
          </Pressable>
        </View>
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
    backgroundColor: '#ffffff',
    padding: 0,
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
  }
});

export default EventsGrid;
