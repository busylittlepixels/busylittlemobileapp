// @ts-nocheck
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Alert, View, TextInput, Text, Button, StyleSheet, ScrollView, Pressable, RefreshControl, Image } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import HorizontalScroller from '../components/HorizontalScroller';
import Spacer from '../components/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitiesGrid from '../components/CitiesGrid';
import EventsGrid from '../components/EventsGrid';

const AccountScreen = ({ navigation, route }: any) => {
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
        fetchFavorites();
        fetchArticles();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem(`favorites_${user.id}`);
            const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
            setFavorites(parsedFavorites);
        } catch (err) {
            console.error('Failed to load favorites:', err);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://blpwp.frb.io/wp-json/wp/v2/news');
            const data = await response.json();
            setArticles(data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleToggleFavorite = async (articleId, title, slug, content) => {
        const isFavorite = favorites[articleId];
        const serializedContent = JSON.stringify(content);
        const result = await toggleFavoriteService(user.id, articleId, title, slug, serializedContent);

        if (result.error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Not added to favorites.',
            });
        } else {
            const updatedFavorites = {
                ...favorites,
                [articleId]: !isFavorite,
            };
            setFavorites(updatedFavorites);
            try {
                await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
            } catch (err) {
                console.error('Failed to save favorites:', err);
            }
            Toast.show({
                type: 'success',
                text1: 'Success!',
                text2: isFavorite ? 'Removed from your favorites.' : 'Added to your favorites.',
            });
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getUserDetails();
        fetchFavorites();
        fetchArticles();
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

    return (
        <ScrollView
            style={{ "flex": 1 }}
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
                {articles.map((item) => (
                    <View key={item.id.toString()} style={styles.item}>
                        <Pressable onPress={() => navigation.navigate('Article', { item })} style={styles.articlePressable}>
                            <Image style={styles.tinyLogo} source={{ uri: 'https://via.placeholder.com/50/800080/FFFFFF' }} />
                            <View>
                                <Text style={styles.title}>{item.title.rendered}</Text>
                                <Text>Here's some bullshit to go with it...</Text>
                            </View>
                        </Pressable>
                        <Button
                            onPress={() => handleToggleFavorite(item.id, item.title.rendered, item.slug, item.content.rendered)}
                            title={favorites[item.id] ? '✓' : '-'}
                        />
                    </View>
                ))}
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
    tinyLogo: {
        width: 50,
        height: 50,
    },
    articlePressable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 5,
    }
});

export default AccountScreen;
