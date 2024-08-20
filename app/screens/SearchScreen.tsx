import Ionicons from '@expo/vector-icons/Ionicons';

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import debounce from 'lodash.debounce';

const data =[
    {
      "id": 1,
      "name": "Apple iPhone 14",
      "description": "Latest model of the Apple iPhone with improved camera and performance."
    },
    {
      "id": 2,
      "name": "Samsung Galaxy S23",
      "description": "High-end smartphone from Samsung with advanced features and design."
    },
    {
      "id": 3,
      "name": "Google Pixel 7",
      "description": "Google's flagship phone with pure Android experience and exceptional camera."
    },
    {
      "id": 4,
      "name": "Sony WH-1000XM5",
      "description": "Industry-leading noise-canceling headphones with superior sound quality."
    },
    {
      "id": 5,
      "name": "Dell XPS 13",
      "description": "Compact and powerful laptop with a stunning display and long battery life."
    },
    {
      "id": 6,
      "name": "Apple MacBook Pro",
      "description": "Professional laptop with M2 chip, excellent performance, and premium build."
    },
    {
      "id": 7,
      "name": "Amazon Echo Dot",
      "description": "Smart speaker with Alexa integration, perfect for voice control and home automation."
    },
    {
      "id": 8,
      "name": "Nintendo Switch",
      "description": "Popular hybrid gaming console with a vast library of exclusive games."
    },
    {
      "id": 9,
      "name": "Sony PlayStation 5",
      "description": "Next-gen gaming console with ultra-fast SSD and immersive gaming experience."
    },
    {
      "id": 10,
      "name": "Bose QuietComfort 45",
      "description": "Comfortable and high-quality noise-canceling headphones, ideal for travel."
    },
    {
        "id": 11,
        "name": "Amsterdam",
        "description": "Capital of The Netherlands. Cool spot. Lots of canals. Smells lovely."
    },
    {
        "id": 12,
        "name": "Dublin",
        "description": "Capital of Ireland. Good food. Decent craic. Avoid the North Inner City."
    },
    {
        "id": 13,
        "name": "New York",
        "description": "Some say capital of world! Cool spot."
    },
    {
        "id": 14,
        "name": "Hamburg",
        "description": "Eine one of them yokes Bitte."
    },
    {
        "id": 15,
        "name": "Ronan",
        "description": "An Irish Developer, based in Amsterdam, with seemingly endless amounts of time to spend faffing about."
    },
    {
        "id": 16,
        "name": "Danger Ro",
        "description": "The evil, actually cool dev-tag for this Irish developer, based in Amsterdam, widely known for being an asshole."
    },
  ]
  

const SearchScreen = ({navigation}:any) => {
    const [searchResults, setSearchResults]= useState([]); 
    const [query, setQuery] = useState('');
     // Debounced search function
     const searchItems = useCallback(
        debounce((query) => {
          if (query) {
            const filteredData = data.filter((item) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
            );
            // @ts-ignore
            setSearchResults(filteredData);
          } else {
            setSearchResults([]);
          }
        }, 300), // 300ms debounce time
        []
    );
    
   
    const handleClear = () => {
        setQuery('');
        setSearchResults([]);
      };
    
      const handleSearch = (text: React.SetStateAction<string>) => {
        setQuery(text);
        if (text) {
          const filteredData = data.filter((item) =>
            // @ts-ignore
            item.name.toLowerCase().includes(text.toLowerCase()) ||
            // @ts-ignore
            item.description.toLowerCase().includes(text.toLowerCase())
          );
          // @ts-ignore
          setSearchResults(filteredData);
        } else {
          setSearchResults([]);
        }
    };
    
    return (
        <View style={styles.innerContainer}>
            <View style={styles.formContainer}>
            
            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Enter your search terms..."
                placeholderTextColor='#000'
                value={query}
                onChangeText={handleSearch}
                />
                {query.length > 0 && (
                <Pressable onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="gray" />
                </Pressable>
                )}
            </View>
            {searchResults && searchResults.length > 0 && 
            <>
                <Text style={styles.searchResultsTitle}>Search Results:</Text>
                <FlatList
                    data={searchResults}
                    // @ts-ignore
                    keyExtractor={(item) => item?.id.toString()}
                    renderItem={({ item }) => (
                    <Pressable 
                    // @ts-ignore
                        key={item.id}
                        onPress={() => navigation.push('Article', { item })}
                        style={styles.item}>
                          {/* @ts-ignore */}
                        <Text style={styles.title}>{item.name}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.description}>{item.description}</Text>
                    </Pressable>
                    )}
                    style={styles.searchResultsPanel}
                    
                />
            </>}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
      },
      label:{
        paddingTop: 10,
        fontWeight: 'bold'
      },
      formContainer:{
        flex: 3,
        marginTop: 20
      },
      innerContainer: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingRight: 16,
        paddingLeft: 16,
        marginTop: 10,
      },
      inputStyle: {
        marginTop: 10,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        color: '#000',
        padding: 10,
        borderRadius: 3
      },
    pageHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center'
    },
    searchResultsPanel: {
        backgroundColor: '#e1e1e1',
        marginVertical: 10
    },
    searchResultsTitle: {
        marginVertical:10,
        fontSize: 16,
        fontWeight: 'bold', 
    },
    item: {
        marginTop: 10,
        marginHorizontal:10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingRight: 30, // Space for the clear button
       
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default SearchScreen;
