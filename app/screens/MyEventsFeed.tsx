import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import EventsListItem from '../components/EventsListItem';
import { useFocusEffect } from '@react-navigation/native';

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

const MyEventsFeed = ({ navigation }:any) => {

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'My Feed' });
    }, [navigation]);

    return(
        <View style={styles.container}>
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
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
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
    },
    calContainer: {
      marginTop: 30
    }
  });

  export default MyEventsFeed;