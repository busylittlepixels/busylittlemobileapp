import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Image, View, Text, ActivityIndicator, StyleSheet, Dimensions, Button } from 'react-native';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { supabase } from '../../supabase'; // Ensure your Supabase client is correctly imported
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import RenderHTML from 'react-native-render-html';

// Define the City type
type City = {
  id: number;            // Unique identifier for the city
  name: string;          // Name of the city
  image: string;         // URL to an image representing the city
  country: string;       // Country where the city is located
  description: string;   // A brief description of the city
  events: string;        // A comma-separated list of events associated with the city
};

const getCityImage = (name:string) => {
  switch (name.toLowerCase()) {
    case 'amsterdam':
      return require('../../assets/images/amsterdam.png');
    case 'dublin':
      return require('../../assets/images/dublin.png');
    case 'london':
      return require('../../assets/images/london.png');
    case 'bogota':
      return require('../../assets/images/bogota.png');
    case 'hamburg':
      return require('../../assets/images/hamburg.png');
    case 'copenhagen':
      return require('../../assets/images/copenhagen.png');
    case 'new york':
        return require('../../assets/images/newyork.png');
    default:
      return require('../../assets/images/dublin.png'); // Fallback image
  }
};

const CityScreen = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<City | null>(null); // Set the state to be of type City or null
  
  useEffect(() => {
    navigation.setOptions({ title: route.params?.city });
  }, [navigation]);

  useEffect(() => {
    const fetchCity = async () => {
      const { data, error } = await supabase.from('cities')
        .select('*')
        .eq('name', route.params?.city)
        .single(); // Since you're fetching a single city, you can use .single() to return a single object

      if (error) {
        console.error(error.message);
      } else {
        setCity(data); // Set the data to the city state
      }
      setLoading(false);
    };

    fetchCity();
  }, [route.params?.city]);

  useEffect(() => {
    if (city) {
      console.log('City details:', city.description);
    }
  }, [city]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!city) {
    return (
      <View style={styles.container}>
        <Text>No city found</Text>
      </View>
    );
  }


  const { name, description, country, image, events } = city;
  const cityImage = getCityImage(name); // Get the image dynamically based on the city name
  // const cityImage = headerImg || require('../../assets/images/dublin.png'); // Fallback image if the city is not in the mapping

  return (
    
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
        headerImage={<Image source={cityImage}  />}>
      <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{name}</ThemedText>
          <Text style={{ color: '#fff'}}>{country}</Text>
      </ThemedView>
      <Text style={styles.content}>{description}</Text>
      
      
      <View>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>

      </ParallaxScrollView>
    

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
    color: '#fff',
  },
  link: {
    color: '#ffffff'
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
  content: {
    color: '#fff',
    paddingVertical:10
  }
});

export default CityScreen;
