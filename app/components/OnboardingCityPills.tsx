// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../../supabase'; // Import your Supabase client instance

const OnboardingCityPills = ({ user, selectedCities, handleCityChange }: any) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Fetch all cities from the 'cities' table
        const { data: citiesData, error: citiesError } = await supabase.from('cities').select('*');

        if (citiesError) throw citiesError;

        // Set the fetched cities
        // @ts-ignore
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  // Function to handle city selection by name
  const handleCityToggle = (cityName: string) => {
    handleCityChange(cityName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingBlock}>
        <Text style={styles.pageHeading}>Select Your City</Text>
        <Text style={{ textAlign: 'center', marginVertical: 10 }}>
          You can edit your preferences in your profile settings.
        </Text>
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
              onPress={() => handleCityToggle(city.name)}
            >
              <Text style={styles.pillText}>{city.name}</Text>
            </Pressable>
          );
        })
      ) : (
        <View>
          <Text style={styles.title}>Fetching Cities...</Text>
        </View>
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
    paddingVertical: 20,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
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

export default OnboardingCityPills;
