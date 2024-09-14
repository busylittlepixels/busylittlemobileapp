// MessagesScreen.tsx
// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, ActivityIndicator, Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "@/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";

// Core function restored
const fetchUserConversations = async (userId) => {
    const { data: messages, error } = await supabase
        .from("messages")
        .select(
            `
            *,
            sender_profile:profiles!messages_sender_id_fkey(full_name, avatar_url),
            receiver_profile:profiles!messages_receiver_id_fkey(full_name, avatar_url)
        `
        )
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }

    const { data: unreadMessages, error: unreadError } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", userId)
        .eq("read", false);

    if (unreadError) {
        console.error("Error fetching unread messages:", unreadError);
        return messages;
    }

    const unreadCountMap = unreadMessages.reduce((acc, curr) => {
        const senderId = curr.sender_id;
        acc[senderId] = (acc[senderId] || 0) + 1;
        return acc;
    }, {});

    const uniqueConversations = [];
    const seenConversations = new Set();

    messages.forEach((message) => {
        const conversationKey = [message.sender_id, message.receiver_id]
            .sort()
            .join("-");
        if (!seenConversations.has(conversationKey)) {
            const otherUserId =
                message.sender_id === userId ? message.receiver_id : message.sender_id;

            uniqueConversations.push({
                ...message,
                unreadCount: unreadCountMap[otherUserId] || 0,
            });
            seenConversations.add(conversationKey);
        }
    });

    return uniqueConversations;
};



const markMessagesAsRead = async (userId, otherUserId) => {
    // Check if userId and otherUserId are valid before proceeding
    if (!userId || !otherUserId) {
        //   console.error('Invalid user IDs:', { userId, otherUserId });
        return;
    }

    try {
        const { data, error } = await supabase
            .from("messages")
            .update({ read: true })
            .eq("receiver_id", userId)
            .eq("sender_id", otherUserId)
            .eq("read", false);

        if (error) {
            throw error;
        }

        console.log(`Marked ${data.length} messages as read`);
    } catch (err) {
        //   console.error('Error marking messages as read:', err);
    }
};

const MessagesScreen = ({ navigation, route }) => {
    const [conversations, setConversations] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;
    const { expoPushToken, handleSendPushNotification } = route.params || {};

    console.log('handleSendPushNotification:',  handleSendPushNotification.handleSendPushNotification);


    const alertNewMessage = async (expoPushToken, senderName, message) => {
      handleSendPushNotification.handleSendPushNotification(
        expoPushToken,
        'New message in BLP app',
        `${senderName}: ${message}`,
      
      );
    }




    const loadConversations = useCallback(async () => {
        try {
            const data = await fetchUserConversations(userId);
            setConversations(data);
        } catch (error) {
            console.error("Error loading conversations:", error);
        }
    }, [userId]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useFocusEffect(
        useCallback(() => {
            loadConversations();
            markMessagesAsRead(userId);
        }, [loadConversations, userId])
    );

    useEffect(() => {
        let channel: RealtimeChannel;
    
        const setupSubscription = async () => {
          channel = supabase
            .channel("messages_channel")
            .on(
              "postgres_changes",
              {
                event: "INSERT",
                schema: "public",
                table: "messages",
              },
              async (payload) => {
                if (payload.new.receiver_id === userId) {
                  await loadConversations();

                  const { data: senderData } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', payload.new.sender_id)
                    .single();
                  
                  const senderName = senderData?.full_name || 'Someone';
                  
                    // Check if handleSendPushNotification is passed
               
                    alertNewMessage(expoPushToken, senderName, payload.new.message)
                    
                  }
            
              }
            )
            .subscribe();
        };
    
        setupSubscription();
    
        return () => {
          if (channel) {
            supabase.removeChannel(channel);
          }
        };

    }, [userId, loadConversations]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadConversations();
        setRefreshing(false);
    }, [loadConversations]);

    const handleChatPress = (receiverId, otherUserName, otherUserAvatar) => {
        markMessagesAsRead(userId, receiverId);
        navigation.navigate("Chat", {
            senderId: userId,
            receiverId,
            otherUserName,
            otherUserAvatar,
        });
    };

    const handleDelete = async (itemId: any) => {
        Alert.alert("Delete", "Are you sure you want to delete this message?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    const { error } = await supabase
                        .from("messages")
                        .delete()
                        .eq("id", itemId);
                    if (error) {
                        console.error("Error deleting message:", error);
                    } else {
                        loadConversations(); // Reload conversations after deletion
                    }
                },
                style: "destructive",
            },
        ]);
    };

    const renderRightActions = (progress, dragX, item) => {
        return (
            <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
        );
    };

    const renderConversationItem = ({ item }) => {
        const isSender = item.sender_id === userId;
        const otherUserId = isSender ? item.receiver_id : item.sender_id;
        const otherUserProfile = isSender
            ? item.receiver_profile
            : item.sender_profile;
        const otherUserName = otherUserProfile?.full_name || "Unknown User";
        const otherUserAvatar = otherUserProfile?.avatar_url;

        const lastMessage = item.message || "No messages yet";
        const lastSenderName = item.sender_id === userId ? "You" : otherUserProfile?.full_name;
        const lastMessagePreview = `${lastSenderName}: ${lastMessage}`;
        const unreadCount = item.unreadCount;

        return (
            <Swipeable
                renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, item, otherUserId)
                }
            >
                <Pressable
                    onPress={() =>
                        handleChatPress(otherUserId, otherUserName, otherUserAvatar)
                    }
                >
                    <View style={styles.conversationItem}>
                        <View style={styles.outerTextContainer}>
                            <Image
                                source={{
                                    uri: otherUserAvatar || "https://via.placeholder.com/50",
                                }}
                                style={styles.avatar}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>{otherUserName}</Text>
                                <Text
                                    style={styles.lastMessage}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {lastMessagePreview}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.timestampContainer}>
                            <Text style={styles.timestamp}>
                                {new Date(item.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                            {unreadCount > 0 && (
                                <View style={styles.unreadCountContainer}>
                                    <Text style={styles.unreadCountText}>{unreadCount}</Text>
                                </View>
                            )}
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
    loadingContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 25,
        marginTop: "50%",
    },
    conversationItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    outerTextContainer: {
        flexDirection: "row",
        flex: 1,
    },
    textContainer: {
        flex: 1,
        flexShrink: 1,
        marginRight: 10,
        alignItems: "flex-start",
    },
    userName: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    lastMessage: {
        color: "#888",
        flexWrap: "wrap",
    },
    timestamp: {
        fontSize: 12,
        color: "#aaa",
        marginTop: 5,
        textAlign: "right",
    },
    deleteButton: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    unreadCountContainer: {
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 10,
    },
    unreadCountText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
    },
});

export default MessagesScreen;