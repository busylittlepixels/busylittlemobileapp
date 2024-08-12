// @ts-nocheck
import React from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  View,
  Text, 
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CitiesGrid = ({ cities }:any) => {

    // console.log('city grid', cities)

  const navigation = useNavigation(); // Get the navigation object

  const images = [
    { id: 1, url: 'https://via.placeholder.com/100/0000FF/808080' },
    { id: 2, url: 'https://via.placeholder.com/100/FF0000/FFFFFF' },
    { id: 3, url: 'https://via.placeholder.com/100/FFFF00/000000' }
  ];

  return (
    <View style={[styles.scrollView, { flexDirection: 'row' }]}>
    
    {cities && cities.cities && cities.cities.length > 0 ? (
        cities.cities.map((city, index) => (
            <Pressable 
            key={index} 
            onPress={() => handleCityPress(city)} 
            style={{ marginBottom: 8 }}
            >
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                {city}
            </Text>
            </Pressable>
        ))
        ) : (
        <Text>No cities selected.</Text>  
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    // marginHorizontal: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default CitiesGrid;
