import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import FavoritesScreen from './FavoritesScreen';
import EventsListItem from '../components/EventsListItem';
import { Calendar } from 'react-native-calendars';

const newsData = [
  {
    id: '1',
    title: 'Breaking News: React Native Updates',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/react-native-updates',
    excerpt: 'React Native has released a new update that includes significant improvements and features...',
  },
  {
    id: '2',
    title: 'How to Use Redux in React Native',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/redux-in-react-native',
    excerpt: 'Learn how to integrate Redux into your React Native applications for better state management...',
  },
  {
    id: '3',
    title: 'Top 10 React Native Libraries for 2024',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/top-10-react-native-libraries',
    excerpt: 'Here are the top 10 libraries that every React Native developer should know in 2024...',
  },
  {
    id: '4',
    title: 'Breaking News: React Native Updates',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/react-native-updates',
    excerpt: 'React Native has released a new update that includes significant improvements and features...',
  },
  {
    id: '5',
    title: 'How to Use Redux in React Native',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/redux-in-react-native',
    excerpt: 'Learn how to integrate Redux into your React Native applications for better state management...',
  },
  {
    id: '6',
    title: 'Top 10 React Native Libraries for 2024',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/top-10-react-native-libraries',
    excerpt: 'Here are the top 10 libraries that every React Native developer should know in 2024...',
  },
  {
    id: '7',
    title: 'Breaking News: React Native Updates',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/react-native-updates',
    excerpt: 'React Native has released a new update that includes significant improvements and features...',
  },
  {
    id: '8',
    title: 'How to Use Redux in React Native',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/redux-in-react-native',
    excerpt: 'Learn how to integrate Redux into your React Native applications for better state management...',
  },
  {
    id: '9',
    title: 'Top 10 React Native Libraries for 2024',
    image: 'https://via.placeholder.com/150',
    link: 'https://news.example.com/top-10-react-native-libraries',
    excerpt: 'Here are the top 10 libraries that every React Native developer should know in 2024...',
  },
  // Add more items as needed
];

const renderItem = ({ item }:any) => (
  <EventsListItem title={item.title} image={item.image} link={item.link} excerpt={item.excerpt} />
);

// Sample Screens for the Tab Navigator
const EventsList = () => (
  
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>My Feed:</Text>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  </View>
);

const Schedule = () => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>My Schedule:</Text>
    <Calendar
      onDayPress={(day: any) => console.log('onDayPress', day) }
      onDayLongPress={(day: any) => console.log('onDayLongPress', day) }
      onMonthChange={(date: any) => console.log('onMonthChange', date) }
      onPressArrowLeft={(goToPreviousMonth: () => void) => {
        console.log('onPressArrowLeft'); goToPreviousMonth();
      }}
      onPressArrowRight={(goToNextMonth: () => void) => {
        console.log('onPressArrowRight'); goToNextMonth();
      }}
    />
  </View>
);

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

const MyEventsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
     <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,  // Hide header for all tabs
        })}
      >
        <Tab.Screen name="My Feed" component={EventsList} 
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'newspaper' : 'newspaper-outline'} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen name="My Schedule" component={Schedule} 
         options={{
           tabBarIcon: ({ focused, color, size }) => (
             <Ionicons 
               name={focused ? 'calendar' : 'calendar-outline'} 
               size={size} 
               color={color} 
             />
           ),
         }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
  list: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignItems: 'flex-start',
    marginLeft: 20
  }
});

export default MyEventsScreen;
