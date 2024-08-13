import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Button} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../../supabase'; // Ensure your Supabase client is correctly imported
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';

// @ts-ignore
const FavoritesScreen = ({ navigation, route }: Props) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('favorites')  // Ensure you use the correct table name, "favorites" or "favourites"
        .select('*')  // Fetch the necessary fields
        .eq('user_id', user?.id);
  
      if (favoriteError) {
        console.error('Error fetching faves:', favoriteError);
        return;
      }
      
      if (favoriteData) {
        setFavorites(favoriteData); // Directly set favoriteData as the new state
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
      fetchFavorites();
    }, [])
  );
  
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <ThemedView style={styles.titleContainer}>
      {user && <Text style={{"color": "red","fontSize": 20}}>Favorite Articles for user: {user?.email}</Text>}
      <View>
        <Text style={styles.faveTitle}>Favourite Articles</Text>
        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <View key={index}>
              {/* @ts-ignore */}
              <Pressable onPress={() => navigation.navigate("Article", { item })}>
                <Text style={styles.faveLinks}>{item.title}</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.noCont}>No favorites as of yet</Text>
        )}
        </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white'
  },
  noCont: {
    color: '#000', // '#000'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    color: 'white',
    paddingTop: 20,
    paddingHorizontal: 16
  },
  faveTitle: {
    color: 'black', 
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold' 
  },
  faveLinks: {
    color: 'black', 
    paddingTop: 10,
    fontSize: 14,
    fontWeight: 'bold' 
  }
});

export default FavoritesScreen;
