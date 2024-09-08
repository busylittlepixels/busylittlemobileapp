import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { supabase } from '@/supabase'; // Replace with your Supabase client
import { useSelector } from 'react-redux';

const fetchUserConversations = async (userId: any) => {
    // Fetch sent messages
    const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select(`
            *,
            sender_profile:profiles!messages_sender_id_fkey(full_name),
            receiver_profile:profiles!messages_receiver_id_fkey(full_name)
        `)
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

    if (sentError) {
        console.error('Error fetching sent messages:', sentError);
        return [];
    }

    // Fetch received messages
    const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select(`
            *,
            sender_profile:profiles!messages_sender_id_fkey(full_name),
            receiver_profile:profiles!messages_receiver_id_fkey(full_name)
        `)
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false });

    if (receivedError) {
        console.error('Error fetching received messages:', receivedError);
        return [];
    }

    // Merge sent and received messages and sort by date
    const allMessages = [...sentMessages, ...receivedMessages];

    // Remove duplicates and only keep the latest message between sender/receiver pairs
    const uniqueConversations: any[] = [];
    const seenPairs = new Set();

    allMessages.forEach((message) => {
        const conversationKey = [message.sender_id, message.receiver_id].sort().join('-');
        if (!seenPairs.has(conversationKey)) {
            uniqueConversations.push(message);
            seenPairs.add(conversationKey);
        }
    });

    // Sort conversations by the most recent message
    // @ts-ignore
    uniqueConversations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return uniqueConversations;
};



const MessagesScreen = ({ navigation, route }: any) => {

    console.log('route params', route.params);

    const [conversations, setConversations] = useState([]);
    // Access Redux state and get the user
    // @ts-ignore
    const user = useSelector((state) => state.auth.user);
    const userId = user.id; // Replace with the logged-in user's ID

    useEffect(() => {
        // Fetch conversations when component mounts
        const loadConversations = async () => {
            const data = await fetchUserConversations(userId);
            // @ts-ignore
            setConversations(data);
        };

        loadConversations();
    }, []);

   
    // Handle navigation to individual chat
    const handleChatPress = (receiverId: any, otherUserName:any) => {
        console.log('handlechat recid', receiverId);
        navigation.navigate('Chat', { senderId: userId, receiverId: receiverId, otherUserName: otherUserName });
    };

    const renderConversationItem = ({ item }: any) => {
        console.log('render conv item', JSON.stringify(item, null, 2)); // Log the item structure

        const isSender = item.sender_id === userId;
        const otherUserId = isSender ? item.receiver_id : item.sender_id;
        const otherUserName = isSender ? item.receiver_profile?.full_name : item.sender_profile?.full_name;
        const lastMessage = item.message;
    
        return (
            <Pressable onPress={() => handleChatPress(otherUserId, otherUserName)}>
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
