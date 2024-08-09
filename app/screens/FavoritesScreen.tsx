import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client

// @ts-ignore
const FavoritesScreen = ({ navigation, route }: Props) => {
  const { user, signOut } = useContext(AuthContext);
  const [loading, setLoading ] = useState(false);
  const [favorites, setFavorites ] = useState();

  useEffect(() => {
    const fetchFavorites = async () => {
    
      
    const { data: favoriteData, error: favoriteError } = await supabase
      .from('favorites')  // Ensure you use the correct table name, "favorites" or "favourites"
      .select('article_id, article_title, article_slug')  // Only fetch the article_id field
      .eq('user_id', user?.id);
  
      if (favoriteError) {
        // console.error('Error fetching favorites:', favoriteError);
        return null;
      } else {
        // console.log('else', favoriteData);
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
      {user && <Text>Favorite Articles for user: {user?.email}</Text>}
      <View>
        <Text>Favourite Articles</Text>
        {favorites && Object.keys(favorites).length > 0 ? (
            Object.entries(favorites).map(([key, item], i) => {
              console.log(item);
                return (
                <View key={i}>
                   {/* @ts-ignore */}
                  <Pressable onPress={() => navigation.navigate("FavoriteSingle", { item })}>
                    {/* @ts-ignore */}
                    <Text>{item?.article_title}</Text>
                  </Pressable>
                </View>
                );
            })
        ) : (
            <Text style={styles.noCont}>No faves as of yet</Text>
        )}
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
