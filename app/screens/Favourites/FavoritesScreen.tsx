// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchFavorites, clearFavorites } from '../../actions/favoriteActions';
import ArticleItem from '@/app/components/ArticleItem';

const SaveButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'darkgreen' : 'green', // Dim the color when pressed
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <Text style={styles.resetButtonText}>{title}</Text>
      </Pressable>
    );
};

const ResetButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'darkred' : 'red', // Dim the color when pressed
          },
          styles.button,
        ]}
        onPress={onPress}
      >
        <Text style={styles.resetButtonText}>{title}</Text>
      </Pressable>
    );
};

const SelectFavoritesButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'lightgray' : 'white', // Dim the color when pressed
          },
          styles.selectFavesButton,
        ]}
        onPress={onPress}
      >
        <Text style={styles.selectFavesButtonText}>{title}</Text>
      </Pressable>
    );
};


const FavoritesScreen = ({ navigation, route }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const favorites = useSelector((state: any) => state.favorite.favorites);
    const [loading, setIsLoading] = useState<boolean>(false);

    const handleResetFavorites = () => {
        const userId = user.id;
        dispatch(clearFavorites(userId));
    };

    const handleStoreFavorites = () => {
        console.log('save faves to profile');
    };


    useFocusEffect(
        useCallback(() => {
            if (user && user.id) {
                dispatch(fetchFavorites(user.id));
            }
        }, [dispatch, user])
    );
   
    return (
        <View style={styles.titleContainer}>
            {/* {user && <Text style={{ color: "green", fontSize: 20 }}>Favorite Articles for user: {user?.email}</Text>} */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.faveTitle}>Favourite Articles</Text>
                {Object.keys(favorites).length > 0 ? (
                    Object.keys(favorites).map((articleId, index) => {
                        const item = favorites[articleId];
                        const featuredMedia = item?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                        // Normalize title and content before passing to ArticleScreen
                        const title = item.title?.rendered || item.title;
                        const content = item.content?.rendered || item.content;

                        return(<ArticleItem
                            key={item.id}
                            item={item}
                            isFavorite={false}
                            featuredMedia={item.featured_media} // Pass the stored featured image
                            />
                        )
                    })
                ) : (
                    <Text style={styles.noCont}>You have no favorites.</Text>
                )}
                
            </ScrollView>
            
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4, width:'100%', position:'relative', paddingVertical: 10 }}>
            {Object.keys(favorites).length > 0 ? (
                <><SaveButton title="Archive" onPress={handleStoreFavorites} style={{ marginBottom: 10, paddingBottom: 50 }} />
                <ResetButton title="Clear" onPress={handleResetFavorites} style={{ marginBottom: 10, paddingBottom: 50 }} /></>
            ) : <SelectFavoritesButton title="View Articles" onPress={handleStoreFavorites} style={{ marginBottom: 10, paddingBottom: 50 }} onPress={() => navigation.replace('Account')} style={{ marginBottom: 10, paddingBottom: 50 }} />}
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: 'black',
    },
    contentContainer:{
        justifyContent: 'space-between',
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
    resetButton: {
        width: '100%',
        backgroundColor: 'red',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 0,
        width: '50%'
    },
    selectFavesButton: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 0,
        width: '100%'
    },
    selectFavesButtonText: {
        color: 'gray',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FavoritesScreen;
