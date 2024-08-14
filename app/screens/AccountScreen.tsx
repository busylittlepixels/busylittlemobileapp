// @ts-nocheck
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, Pressable, Button, StyleSheet } from 'react-native';
import { supabase } from '../../supabase';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import HorizontalScroller from '../components/HorizontalScroller';
import CitiesGrid from '../components/CitiesGrid';
import EventsGrid from '../components/EventsGrid';
import { toggleFavorite as toggleFavoriteService } from '../services/favouriteService';

const AccountScreen = ({ navigation }:any) => {
    const { user, signOut } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [username, setUsername] = useState([]);
    const [website, setWebsite] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [cities, setCities] = useState([]);
    const [articles, setArticles] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [data, setData] = useState(null);

    const fetchData = async () => {
        if (!user || !user.id) return;

        setLoading(true);
        setError(null);

        try {
            const [{ data: userDetails, error: userError }, 
                   { data: citiesData, error: citiesError }, 
                   { data: ticketsData, error: ticketsError }] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('profiles').select('cities').eq('id', user.id).single(),
                supabase.from('tickets').select('*')
            ]);

            if (userError) setError(userError.message);
            else setProfile(userDetails);

            if (citiesError) setError(citiesError.message);
            else setCities(citiesData);

            if (ticketsError) setError(ticketsError.message);
            else setTickets(ticketsData);

            const savedFavorites = await AsyncStorage.getItem(`favorites_${user.id}`);
            setFavorites(savedFavorites ? JSON.parse(savedFavorites) : {});

            const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news',{
                headers: {
                  'Content-Type': 'application/json',
                }
              });
            const articlesData = await response.json();
            setArticles(articlesData);

        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log('refreshing, please standby')
        fetchData().finally(() => setRefreshing(false));
    }, []);

    const handleToggleFavorite = async (articleId: string | number, title: any, slug: any, content: any) => {
        // @ts-ignore
        const isFavorite = favorites[articleId];
        const serializedContent = JSON.stringify(content);
        const result = await toggleFavoriteService(user?.id, articleId, title, slug, serializedContent);

        if (result.error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update favorites.' });
        } else {
            const updatedFavorites = { ...favorites, [articleId]: !isFavorite };
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
            Toast.show({ type: 'success', text1: 'Success', text2: isFavorite ? 'Removed from favorites.' : 'Added to favorites.' });
        }
    };

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.contentContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.accountDetails}>
                <Text style={styles.sectionTitle}>Account:</Text>
                {user && (
                    <>
                        <Text>Hey {profile?.username}</Text>
                        <Text>Email: {user.email}</Text>
                    </>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Latest:</Text>
                <HorizontalScroller />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Selected Cities:</Text>
                <CitiesGrid cities={profile?.cities || cities.cities} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Events:</Text>
                <EventsGrid tickets={tickets} />
            </View>

            <View style={styles.section}>
                <Text style={styles.articleSectionTitle}>Articles:</Text>
                <View>
                {articles.map(item => (
                    <View key={item.id} style={styles.item}>
                        <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
                            <Image style={styles.tinyLogo} source={{ uri: 'https://via.placeholder.com/50/800080/FFFFFF' }} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                                    {item.title.rendered}
                                </Text>
                                <Text style={styles.description}>Here's some description...</Text>
                            </View>
                        </Pressable>
                        <Button onPress={() => handleToggleFavorite(item.id, item.title?.rendered, item.slug, item.content?.rendered)} title={favorites[item.id] ? '✓' : '-'} />
                    </View>
                ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: { },
    accountDetails: { padding: 20, backgroundColor: '#e1e1e1', elevation: 5 },
    section: { padding: 20, backgroundColor: '#ffffff', elevation: 5 },
    eventsSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    articlePressable: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Ensure Pressable takes up available space
    },
    tinyLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Ensure text container takes up available space
        alignItems: 'flex-start'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        maxWidth: '100%', // Ensure title doesn't overflow
    },
    description: {
        fontSize: 14,
        color: '#666',
    }
});
  

export default AccountScreen;
