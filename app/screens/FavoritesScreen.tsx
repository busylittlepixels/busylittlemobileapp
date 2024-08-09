import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client

// @ts-ignore
const FavoritesScreen = ({ navigation }: Props) => {
  const { user, signOut } = useContext(AuthContext);
  const [loading, setLoading ] = useState(false);
  const [favorites, setFavorites ] = useState();

  useEffect(() => {
    const fetchFavorites = async () => {
    
      
    const { data: favoriteData, error: favoriteError } = await supabase
      .from('favorites')  // Ensure you use the correct table name, "favorites" or "favourites"
      .select('article_id')  // Only fetch the article_id field
      .eq('user_id', user?.id);
  
      if (favoriteError) {
        console.error('Error fetching favorites:', favoriteError);
        return null;
      } else {
        console.log('else faves', favoriteData);
         // Ensure favoriteData is not undefined or null
        if (favoriteData !== undefined && favoriteData !== null) {
          // @ts-ignore
          setFavorites(favoriteData); // Directly set favoriteData as the new state
        } else {
          console.error('favoriteData is null or undefined');
        }
      }

      
      setLoading(false);
    };

    fetchFavorites();

  }, []);
          

  return (
    <View style={styles.container}>
      <Text>Payment Screen (and temp faves) </Text>
      {user && <Text>Payment Screen for user: {user?.email}</Text>}
      <View>

        <Text>FAVES</Text>
        {favorites ? Object.entries(favorites).map(([key, favorite], i) => {
        console.log(favorite);
        return (
          // @ts-ignore
          <Text key={i}>{favorite.article_id}</Text>
        );
      }) : <Text style={styles.noCont}>No faves as of yet</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noCont: {
    color: 'black'
  }
});

export default FavoritesScreen;
