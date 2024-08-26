// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { supabase } from '../../../supabase';// Import your configured Supabase client

const UsersScreen = ({ navigation }:any) => {
    const [users, setUsers] = useState([]); // State to hold all users

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'All Users' });

        const getAllUsers = async () => {
            try {
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select('*');
                
                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setUsers(data); // Store users in state
                }
            } catch (error) {
                console.log('Error fetching users:', error.message);
            }
        };

        getAllUsers(); // Call the function to fetch all users
    }, [navigation]);

    const renderItem = ({ item }:any) => (
        <View style={styles.userItem}>
            <Text style={styles.userName}>{item?.full_name ? item.full_name : item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {users.length > 0 ? (
                <FlatList
                    data={users}
                    // @ts-ignore
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderItem}
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
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    userName: {
        fontSize: 16,
        color: '#000',
    },
    noUsersText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: '#888',
    },
});

export default UsersScreen;
