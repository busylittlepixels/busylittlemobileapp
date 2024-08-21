import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabase'; // Ensure your Supabase client is correctly imported
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/app/components/ThemedView';

const FavoritesScreen = ({ navigation, route }:any) => {
  // @ts-ignore
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id);
  
      if (favoriteError) {
        console.error('Error fetching faves:', favoriteError);
        return;
      }
      
      if (favoriteData) {
        // @ts-ignore
        setFavorites(favoriteData);
      } else {
        console.error('favoriteData is null or undefined');
      }
    } catch (error) {
      console.error('Error during fetchFavorites:', error);
    } finally {
      setLoading(false);
    }
  };


  
  useFocusEffect(
   
    useCallback(() => {
      console.log('reloaded faves');
      fetchFavorites();
    }, [route]) // Include route as a dependency to trigger refetch when navigating back
  );

  useEffect(() => {
    if (route.params?.refetchFavorites) {
      fetchFavorites();
    }
  }, [route.params?.refetchFavorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Sync data from AsyncStorage
    fetchFavorites().then(() => setRefreshing(false));
    
    setTimeout(() => {
        setRefreshing(false);
        console.log('should refresh user details');
    }, 2000);
  }, []);

  return (
    <ThemedView style={styles.titleContainer}>
      {user && <Text style={{ color: "red", fontSize: 20 }}>Favorite Articles for user: {user?.email}</Text>}
      <ScrollView
        style={{ flex: 1 }}
        // @ts-ignore
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.faveTitle}>Favourite Articles</Text>
        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <View key={index}>
              <Pressable onPress={() => navigation.navigate("Article", { item, isFavorite: true })}>
                {/* @ts-ignore */}
                <Text style={styles.faveLinks}>{item?.title}</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.noCont}>No favorites as of yet</Text>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'black',
  },
  noCont: {
    color: '#000',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    color: '#000',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  faveTitle: {
    color: '#000', 
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  faveLinks: {
    color: 'black', 
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
