// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../../supabase'; // Import your Supabase client instance

const CityPills = ({ user }: any) => {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

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

  return (
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
                isCitySelected && { backgroundColor: '#CCCCCC' }, // Apply different background color for selected cities
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
});

export default CityPills;
