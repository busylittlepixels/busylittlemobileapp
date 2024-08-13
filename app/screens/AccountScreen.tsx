// @ts-nocheck
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Alert, View, TextInput, Text, Button, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import HorizontalScroller from '../components/HorizontalScroller';
import UserArticles from '../components/UserArticles';
import Spacer from '../components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitiesGrid from '../components/CitiesGrid';
import EventsGrid from '../components/EventsGrid';

const AccountScreen = ({ navigation }:any) => {
    const { user, signOut } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [username, setUsername] = useState([]);
    const [website, setWebsite] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [cities, setCities] = useState([]);;
  

   

    const getUserDetails = async () => {
      if (user && user.id) {
        const { data, error } = await supabase.from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
  
        if (error) {
          // @ts-ignore
          setError(error.message);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getUserDetails();
    }, [user, profile]);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      getUserDetails();
      console.log('mmmm refreshing...')
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);
   
    useEffect(() => {
      const fetchCities = async () => {
        const { data, error } = await supabase.from('profiles')
          .select('cities')
          .eq('id', user.id)
          .single();
        
          if (error) {
          // @ts-ignore
          setError(error.message);
        } else {
          // @ts-ignore
          setCities(data);
        }
        setLoading(false);
      };
  
      fetchCities();
    }, []);


    useEffect(() => {
      const fetchTickets = async () => {
        const { data, error } = await supabase.from('tickets').select('*');
        if (error) {
          // @ts-ignore
          setError(error.message);
        } else {
                  // @ts-ignore
          setTickets(data);
        }
        setLoading(false);
      };
      fetchTickets();
    }, []);
  
  
    const handleCityPress = (city) => {
      navigation.navigate('City', { city });
    };

    useFocusEffect(
      useCallback(() => {
        getUserDetails();
      }, [])
    );

    return (
        <ScrollView
          style={{ "flex": 1}}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Section 1 */}
        <View style={styles.accountDetails}>
        <Text style={styles.sectionTitle}>Account:</Text>
        {user && (
          <>
            <View>
            {/* @ts-ignore */}
            <Text>Hey {profile?.username}</Text>
            <Text>Email: {user.email}</Text>
            
          </View>
          </>
        )}
        </View>



        {/* Section 2 */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Latest:</Text>
            <HorizontalScroller />
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Selected Cities:</Text>
          <CitiesGrid cities={profile?.cities ? profile.cities : cities.cities} />
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Events:</Text>
            <EventsGrid tickets={tickets} />
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
            <Text style={styles.articleSectionTitle}>Articles:</Text>
            <UserArticles userId={profile?.id}/>
        </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    // paddingTop: StatusBar.currentHeight || 20,
  },
  contentContainer: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  eventsSection: {
    backgroundColor: '#ffffff',
    padding: 0,
  },
  section: {
    // marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    // borderRadius: 10,
    // Shadow for iOS
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // Shadow for Android
    elevation: 5,
  },
  accountDetails: {
  padding: 20,
  backgroundColor: '#e1e1e1',
  // borderRadius: 10,
  // shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
  },
  item: {
  paddingVertical: 16,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
title: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
},
buttons: {
  // backgroundColor: 'cornflowerblue',
  display: 'flex',
  flexDirection: 'row',
  margin: 10, 
  alignItems: 'center',
  gap: 4,
  padding: 16
},

articleSectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 2,
},
sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AccountScreen;
