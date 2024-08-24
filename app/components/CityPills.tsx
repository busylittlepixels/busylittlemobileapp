// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../../supabase'; // Import your Supabase client instance
import { useNavigation } from '@react-navigation/native'; 
import { TransitionPresets } from '@react-navigation/stack';

const BackButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#ddd' : 'gray', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.pillText}>{title}</Text>
    </Pressable>
  );
};

const ClearButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#ddd' : 'red', // Dim the color when pressed
        },
        styles.clearButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.pillText}>{title}</Text>
    </Pressable>
  );
};

const CityPills = ({ user }: any) => {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchCitiesAndUserSelections = async () => {
      try {
        // Fetch all cities from the 'cities' table
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('*');

        if (citiesError) throw citiesError;

        // Fetch user's selected cities from the 'profiles' table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('cities')
          .eq('id', user.id)  // Changed 'user.Id' to 'user.id'
          .single();

        if (profileError) throw profileError;

        const userCities = profileData?.cities || [];

        // Set the fetched cities
        setCities(citiesData);
        // Set the cities that are already selected by the user
        setSelectedCities(userCities);
      } catch (error) {
        console.error('Error fetching cities or user profile data:', error);
      }
    };

    fetchCitiesAndUserSelections();
  }, [user]);

  // Function to handle city selection by name
  const handleCityToggle = async (cityName) => {
    console.log('toggle', cityName);
    
    const isSelected = selectedCities.includes(cityName);

    let updatedCities;

    if (isSelected) {
      // Remove the city from selectedCities
      updatedCities = selectedCities.filter((name) => name !== cityName);
    } else {
      // Add the city to selectedCities
      updatedCities = [...selectedCities, cityName];
    }

    // Update the selected cities in the state
    setSelectedCities(updatedCities);
      
    const userId = user?.id; 
    // Update the user's profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ cities: updatedCities })
      .eq('id', userId); // Ensure 'user.id' is correctly referenced

    if (error) {
      console.error('Error updating user cities:', error);
    } else {
      console.log('updated data', error);
      console.log('User cities updated successfully!');
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', { user });
  };


  const clearCities = () => {
    console.log('clear cities');
    setSelectedCities([]);
  }; 
  

  return (
    <>
    <View style={styles.container}>
      <View style={styles.headingBlock}>
        <Text style={styles.pageHeading}>
          Select Your City
          </Text>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>You can edit your preferences in your profile settings.</Text>
      </View>
      {cities.length > 0 ? (
        cities.map((city) => {
          const isCitySelected = selectedCities.includes(city.name);

          return (
            <Pressable
              key={city.id}
              style={[
                styles.pill,
                isCitySelected && styles.selectedPill,
                isCitySelected && { backgroundColor: '#000' }, // Apply different background color for selected cities
              ]}
              onPress={() => !isCitySelected && handleCityToggle(city.name)} // Disable press if already selected
              disabled={isCitySelected} // Disable pressable for already selected cities
            >
              <Text style={styles.pillText}>{city.name}</Text>

              
            </Pressable>
          );
        })
      ) : (
        <View><Text style={styles.title}>Fetching Cities...</Text></View>  // Handle case where cities array is empty
      )}
    </View>
    <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
      <BackButton title="Back to Profile" onPress={navigateToProfile} />
      <ClearButton title="Clear Selection" onPress={clearCities} />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  headingBlock: {
    paddingVertical:20,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center'
  },
  pill: {
    backgroundColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  selectedPill: {
    backgroundColor: '#007BFF',
  },
  pillText: {
    color: '#fff',
  },
  button: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    color: '#fff',
  },
  clearButton: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    color: '#fff',
  },
  buttonText: {
    // color: '#FFFFFF', // White text
  }
});

export default CityPills;
