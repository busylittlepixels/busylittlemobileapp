// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { Alert, View, Text, StyleSheet, RefreshControl, Image, FlatList, Pressable } from 'react-native';
import { supabase } from '../../../supabase'; 
import { useSelector } from 'react-redux'; 
import { useFocusEffect } from '@react-navigation/native';

const UsersScreen = ({ navigation }: any) => {
    const [users, setUsers] = useState([]); 
    const user = useSelector((state) => state.auth.user);
    const [refreshing, setRefreshing] = useState(false);

    console.log('user', user);

    // Alert and log for pinging an online user
    const pingUser = (listedUserId, listedUsername) => {
        // console.log('fuch yeah');
        // console.log('current user id', user.id);
        // console.log('current user name', user.user_metadata?.username);
        // console.log('Listed user id:', listedUserId);
        // console.log('Listed user name:', listedUsername);

        Alert.alert(
            'User Pinged',
            `Current user (ie, you: ${user.user_metadata?.username}) pinged user: ${listedUsername}`
        );
    };

    // Alert and log for pinging an offline user
    const pingUserOffline = (listedUserId, listedUsername) => {
        // console.log('derp');
        // console.log('user is offline', user.id);
        // console.log('current user name', user.user_metadata?.username);
        // console.log('Listed user id:', listedUserId);
        // console.log('Listed user name:', listedUsername);

        Alert.alert(
            'User Pinged (Offline)',
            `Current user (ie, you: ${user.user_metadata?.username}) pinged user: ${listedUsername ? listedUsername : listedUserId}, but their profile is not publically accessible`
        );
    };

    const getAllUsers = async () => {
        try {
            const { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .neq('user_id', user.id);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsers(data);
            }
        } catch (error) {
            console.log('Error fetching users:', error.message);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getAllUsers().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'All Users' });
        getAllUsers();
    }, [navigation]);

    const GreenDot = () => {
        return <View style={styles.greenDot} />;
    };

    const GrayDot = () => {
        return <View style={styles.grayDot} />;
    };

    const renderItem = ({ item }) => {
        const displayText = item?.username
            ? item.username
            : item?.full_name
            ? item.full_name
            : item.email
            ? item.avatar_url
            : item.avatar_url;
        const isEmailDisplayed = !item?.username && !item?.full_name;
    
        return (
            <View style={styles.userItem}>
                {item.enablepublicprofile ? (
                    <Pressable
                        onPress={() => pingUser(item?.id, item?.username)}  // Pass listed user id to pingUser
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12}}>
                        {item.avatar_url &&
                        
                            <Image 
                              source={{ uri: item.avatar_url }} 
                              style={[
                                styles.image, 
                                {width: 40, height: 40, borderRadius: '50%'}
                              ]} 
                            />
                        }
                        <Text
                            style={[
                                styles.userName,
                                isEmailDisplayed && styles.emailText,
                            ]}
                        >
                            {displayText}
                        </Text>
                        </View>
                        <GreenDot />
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => pingUserOffline(item?.id, item?.username)}   // Pass listed user id to pingUserOffline
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12}}>
                        {item.avatar_url &&
                        
                            <Image 
                              source={{ uri: item.avatar_url }} 
                              style={[
                                styles.image, 
                                {width: 40, height: 40, borderRadius: '50%'}
                              ]} 
                            />
                            }
                            
                            <Text
                                style={[
                                    styles.userName,
                                    isEmailDisplayed && styles.emailText,
                                ]}
                            >
                                {displayText}
                            </Text>
                        </View>
                        <GrayDot />
                    </Pressable>
                )}
            </View>
        );
    };
    

    useFocusEffect(
        useCallback(() => {
            getAllUsers();
        }, [user])
    );

    return (
        <View style={styles.container}>
            {users.length > 0 ? (
                <FlatList
                    data={users}
                    // @ts-ignore
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <Text style={styles.noUsersText}>No users found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    userItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    userName: {
        fontSize: 16,
        color: '#000',
        textAlign: 'left',
        alignItems: 'flex-start'
    },
    emailText: {
        color: 'red', 
    },
    noUsersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#888',
    },
    greenDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'green',
    },
    grayDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'gray',
    },
});

export default UsersScreen;
