// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, ActivityIndicator, Alert, Image } from 'react-native';
import { supabase } from '@/supabase'; // Replace with your Supabase client
import { useSelector } from 'react-redux';
import { Swipeable } from 'react-native-gesture-handler'; // Import from gesture handler

const fetchUserConversations = async (userId: any) => {
    // Fetch the latest message for each conversation
    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender_profile:profiles!messages_sender_id_fkey(full_name, avatar_url),
            receiver_profile:profiles!messages_receiver_id_fkey(full_name, avatar_url)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    const uniqueConversations = [];
    const seenPairs = new Set();

    messages.forEach((message) => {
        const conversationKey = [message.sender_id, message.receiver_id].sort().join('-');
        if (!seenPairs.has(conversationKey)) {
            uniqueConversations.push(message); // Only push the latest message for each conversation
            seenPairs.add(conversationKey);
        }
    });

    return uniqueConversations;
};

const markMessagesAsRead = async (userId) => {
    try {
        const { error } = await supabase
            .from('messages')
            .update({ read: true }) // Assuming you have a 'read' field in your messages schema
            .eq('receiver_id', userId)
            .eq('read', false); // Mark only unread messages as read

        if (error) {
            console.error('Error marking messages as read:', error);
        }
    } catch (err) {
        console.error('Error:', err);
    }
};

const MessagesScreen = ({ navigation, route }: any) => {
    const [conversations, setConversations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    const loadConversations = useCallback(async () => {
        try {
            const data = await fetchUserConversations(userId);
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }, [userId]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
            markMessagesAsRead(userId); // Mark messages as read when returning to this screen
        }, [loadConversations, userId])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);  // Start the refresh
        await loadConversations();  // Fetch new data
        setRefreshing(false);  // Stop the refresh
    }, [loadConversations]);

    const handleChatPress = (receiverId: any, otherUserName: any) => {
        navigation.navigate('Chat', { senderId: userId, receiverId, otherUserName });
    };

    const handleDeleteAllChats = async (item: any, receiverId: any) => {
        Alert.alert('Delete', 'Are you sure you want to delete the entire conversation?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    const { error } = await supabase
                        .from('messages')
                        .delete()
                        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                        .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`);

                    if (error) {
                        console.error('Error deleting conversation:', error);
                    } else {
                        loadConversations();  // Reload after deletion
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const handleDelete = async (itemId: any) => {
        Alert.alert('Delete', 'Are you sure you want to delete this message?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    const { error } = await supabase
                        .from('messages')
                        .delete()
                        .eq('id', itemId);
                    if (error) {
                        console.error('Error deleting message:', error);
                    } else {
                        loadConversations();  // Reload conversations after deletion
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const renderRightActions = (progress, dragX, item) => {
        return (
            <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
        );
    };

    const renderConversationItem = ({ item }) => {
        // Determine who the other user is
        const isSender = item.sender_id === userId;
        const otherUserId = isSender ? item.receiver_id : item.sender_id;
        const otherUserProfile = isSender ? item.receiver_profile : item.sender_profile;
        const otherUserName = otherUserProfile?.full_name || 'Unknown User';
        const otherUserAvatar = otherUserProfile?.avatar_url;

        // Get the last message details
        const lastMessage = item.message || 'No messages yet'; // Fallback if no messages
        const lastSenderName = item.sender_id === userId ? 'You' : otherUserProfile?.full_name;

        // Display the last message preview as "LastSender: last message"
        const lastMessagePreview = `${lastSenderName}: ${lastMessage}`;

        return (
            <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item, otherUserId)}>
                <Pressable onPress={() => handleChatPress(otherUserId, otherUserName)}>
                    <View style={styles.conversationItem}>
                        {/* Display the user's avatar */}
                        <View style={styles.outerTextContainer}>
                            <Image
                                source={{ uri: otherUserAvatar || 'https://via.placeholder.com/50' }} // Fallback to placeholder if no avatar
                                style={styles.avatar}
                            />
                            {/* Text Container */}
                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>{otherUserName}</Text>
                                {/* Last message preview: Last sender + last message */}
                                <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
                                    {lastMessagePreview}
                                </Text>
                                <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleDateString()}</Text>
                            </View>
                        </View>

                        <View style={styles.timestampContainer}>
                            <Text style={styles.timestamp}>
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Swipeable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={(item) => item?.id.toString()}
                renderItem={renderConversationItem}
                ListEmptyComponent={
                    <View style={styles.loadingContainer}>
                        <Text style={styles.title}>Loading messages...</Text>
                        <ActivityIndicator size="large" />
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    conversationItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure spacing between avatar, text, and timestamp
        flex: 1, // Take up the available width
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25, // Circular avatar
        marginRight: 10,
    },
    outerTextContainer: {
        flexDirection: 'row',
        flex: 1, // Take up remaining space to prevent overflow
    },
    textContainer: {
        flex: 1, // Take up remaining space
        flexShrink: 1, // Allow the text container to shrink and wrap
        marginRight: 10, // Space between text and timestamp
        alignItems: 'flex-start',
    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastMessage: {
        color: '#888',
        flexWrap: 'wrap', // Ensure text wraps within the available space
    },
    timestamp: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 5,
        textAlign: 'right', // Align the timestamp to the right
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MessagesScreen;
