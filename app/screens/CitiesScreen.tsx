// @ts-nocheck
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { supabase } from '../../supabase'; // Import your Supabase client instance
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import CityPills from '../components/CityPills';

const CitiesScreen = () => {
  const { user, signOut } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const loadDataFromStorage = async () => {
      

      try {
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length > 0) {
          const result = await AsyncStorage.multiGet(keys);
          console.log('In storage, called from City', result)
          const storedData = result.map(([key, value]) => ({ [key]: value }));
          
          // If you expect JSON values, you might need to parse them individually
          const parsedData = storedData.map(item => {
            const key = Object.keys(item)[0];
            try {
              return { [key]: JSON.parse(item[key]) };
            } catch (e) {
              // Handle case where data isn't JSON
              return { [key]: item[key] };
            }
          });
          setData(parsedData);
        } else {
          console.log('No data found in storage');
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage', error);
      }
  };


  // if(user){
  //   console.log('user in CityScreen', user);
  //   console.log('user ID in CityScreen', user.id);
  // }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Sync data from AsyncStorage
    loadDataFromStorage().then(() => setRefreshing(false));
    
    setTimeout(() => {
        setRefreshing(false);
        // console.log('should refresh user details');
    }, 2000);
}, []);

  return (
    <ScrollView
        style={{ "flex": 1}}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <CityPills user={user} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default CitiesScreen;
