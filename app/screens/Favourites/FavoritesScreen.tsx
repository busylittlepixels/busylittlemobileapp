// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchFavorites, clearFavorites } from '../../actions/favoriteActions';


const ResetButton = ({ title, onPress }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'darkred' : 'red', // Dim the color when pressed
          },
          styles.resetButton,
        ]}
        onPress={onPress}
      >
        <Text style={styles.resetButtonText}>{title}</Text>
      </Pressable>
    );
};



const FavoritesScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const favorites = useSelector((state: any) => state.favorite.favorites);
    const [loading, setIsLoading] = useState<boolean>(false);

    const handleResetFavorites = () => {
        const userId = user.id;
        dispatch(clearFavorites(userId));
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
                        

                        // Normalize title and content before passing to ArticleScreen
                        const title = item.title?.rendered || item.title;
                        const content = item.content?.rendered || item.content;

                        console.log('Rendering favorite item:', title);
                        
                        return (
                            <Pressable 
                                key={index}
                                onPress={() => {
                                    navigation.navigate("Article", { item: { ...item, title, content },  isFavorite: true });
                                }}
                            >
                                <Text style={styles.faveLinks}>{title}</Text>
                            </Pressable>
                        );
                    })
                ) : (
                    <Text style={styles.noCont}>You have no favorites.</Text>
                )}
                
            </ScrollView>
            {Object.keys(favorites).length > 0 ? (
            <ResetButton title="Clear All Favorites" onPress={handleResetFavorites} style={{ marginBottom: 10, paddingBottom: 50 }} />
            ) : null}
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
});

export default FavoritesScreen;
