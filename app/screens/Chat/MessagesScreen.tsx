import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { supabase } from '@/supabase'; // Replace with your Supabase client
import { useSelector } from 'react-redux';

// Function to fetch user conversations
const fetchUserConversations = async (userId: any) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*, profiles!messages_sender_id_fkey(*)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }

    return data; // Return the list of messages
};


const MessagesScreen = ({ navigation, route }: any) => {

    const [conversations, setConversations] = useState([]);
    // Access Redux state and get the user
    // @ts-ignore
    const user = useSelector((state) => state.auth.user);
    const userId = user.id; // Replace with the logged-in user's ID

    useEffect(() => {
        // Fetch conversations when component mounts
        const loadConversations = async () => {
            const data = await fetchUserConversations(userId);
            //   @ts-ignore
            setConversations(data);
        };

        loadConversations();
    }, []);

    // Handle navigation to individual chat
    const handleChatPress = (receiverId: any) => {
        navigation.navigate('Chat', { senderId: userId, receiverId });
    };

    // Render each conversation item
    const renderConversationItem = ({ item }: any) => {
        const isSender = item.sender_id === userId;
        const otherUserId = isSender ? item.receiver_id : item.sender_id;
        const otherUserName = isSender ? item.receiver_name : item.sender_name; // Replace with correct data
        const lastMessage = item.message;
        

        
        return (
            <Pressable onPress={() => handleChatPress(otherUserId)}>
                <View style={styles.conversationItem}>
                    <Text style={styles.userName}>{otherUserName || 'Unknown User'}</Text>
                    <Text style={styles.lastMessage}>{lastMessage}</Text>
                    <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                // @ts-ignore
                keyExtractor={(item) => item?.id.toString()}
                renderItem={renderConversationItem}
                ListEmptyComponent={<Text>No conversations found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    conversationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userName: {
        fontWeight: 'bold',
    },
    lastMessage: {
        color: '#888',
    },
    timestamp: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 5,
    },
});

export default MessagesScreen;
