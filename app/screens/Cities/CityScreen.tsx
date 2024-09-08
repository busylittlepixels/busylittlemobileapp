// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Image, View, Text, ActivityIndicator, StyleSheet, Button, Pressable } from 'react-native';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { supabase } from '../../../supabase';
import { ThemedText } from '@/app/components/ThemedText';
import { ThemedView } from '@/app/components/ThemedView';
import { Collapsible } from '@/app/components/Collapsible';

type City = {
  id: number;
  name: string;
  image: string;
  country: string;
  description: string;
  events: string;
};

const getCityImage = (name: string) => {
  switch (name.toLowerCase()) {
    case 'amsterdam':
      return require('./../../assets/images/amsterdam.png');
    case 'dublin':
      return require('./../../assets/images/dublin.png');
    case 'london':
      return require('./../../assets/images/london.png');
    case 'bogota':
      return require('./../../assets/images/bogota.png');
    case 'hamburg':
      return require('./../../assets/images/hamburg.png');
    case 'copenhagen':
      return require('./../../assets/images/copenhagen.png');
    case 'new york':
      return require('./../../assets/images/newyork.png');
    default:
      return require('./../../assets/images/klingons.png');
  }
};

const CityScreen = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<City | null>(null);

  const OutlineButton = ({ title, onPress }: any) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'gray' : 'black', // Light green on press, green otherwise
            borderColor: 'white', // White outline
            borderWidth: 2, // Outline width
            borderRadius: 5, // Rounded corners
            padding: 10
          },
          styles.button, // Full-width button styles
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    );
  };



  useEffect(() => {
    navigation.setOptions({ title: route.params?.city });
  }, [navigation]);

  useEffect(() => {
    const fetchCity = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('name', route.params?.city)
        .single();

      if (error) {
        console.error(error.message);
      } else {
        setCity(data);
      }
      setLoading(false);
    };

    fetchCity();
  }, [route.params?.city]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!city) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No city found</Text>
      </View>
    );
  }

  const { name, description, country } = city;
  const cityImage = getCityImage(name);

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#353636', dark: '#D0D0D0' }}
        backgroundColor="#353636" // Set the background color of the scroll view itself
        contentBackgroundColor="#353636" // Set the content background color
        headerImage={<Image source={cityImage} style={styles.headerImage} />}
      >
        <ThemedView style={styles.contentContainer}>
          <ThemedText type="title" style={styles.text}>
            {name}
          </ThemedText>
          <Text style={[styles.text,{ marginVertical: 10}]}>{country}</Text>
          <Text style={styles.content}>{description}</Text>
        </ThemedView>

        <Collapsible title="Travel Information">
            <ThemedText style={styles.content}>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible>

        {/* <Collapsible title="Race Details & Conditions">
            <ThemedText>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible> */}

        <Collapsible title="Upcoming Events">
            <ThemedText style={styles.content}>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible>

        <Collapsible title="FAQ">
            <ThemedText style={styles.content}>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible>

        <Collapsible title="Contact">
            <ThemedText>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
        </Collapsible>
        <Spacer space={20} />
        <View style={[styles.buttonContainer, { display: 'flex', flexDirection: 'row', gap: 4, width:'100%', paddingVertical: 10, paddingHorizontal: 30, marginVertical: 10 }]}>
          <OutlineButton title="Go Back" onPress={() => navigation.goBack()} color="#fff" />
        </View>
      </ParallaxScrollView>

      {/* <View style={styles.buttonContainer}>
        <Button title="Go Back" onPress={() => navigation.goBack()} color="#fff" />
      </View> */}
     
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Ensure the container has a white background
},
  headerImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    flex: 1, 
    // paddingHorizontal: 0, // Horizontal padding
    justifyContent: 'center',
    // backgroundColor: 'green'
    height: '100%'
  },
  text: {
    color: 'white',
  },
  content: {
    color: 'white',
    textAlign: 'left',
  },
  buttonContainer: {
    padding: 10,
    position: 'absolute', // Position the button at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
  },
  button: {
    width: '100%', // Full width
    paddingVertical: 12, // Vertical padding for the button
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    borderRadius: 5, // Rounded corners
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CityScreen;
