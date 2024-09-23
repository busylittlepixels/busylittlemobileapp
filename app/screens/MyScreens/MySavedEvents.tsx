// MySavedEventList.tsx
// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl, ActivityIndicator, Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "@/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";

const MySavedEventList = ({ navigation }) => {
    const [savedEvents, setSavedEvents] = useState([]); 
    const [refreshing, setRefreshing] = useState(false);
    // @ts-ignore
    const user = useSelector((state) => state.auth.user);
    
    const fetchSavedEvents = async () => {
      const { data, error } = await supabase
        .from('profile_events')
        .select(`
          event_id,
          events (
            id,
            event_name,
            description,
            start_date, 
            end_date, 
            event_location, 
            event_image
          )
        `)
        .eq('profile_id', user.id);
    
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        // console.log('Fetched events:', data);
        // @ts-ignore
        setSavedEvents(data); 
      }
    };
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchSavedEvents();
        setRefreshing(false);
    }, [fetchSavedEvents]);
    
    useFocusEffect(
      useCallback(() => {
          fetchSavedEvents();
         
      }, [fetchSavedEvents, user.id])
    );

    useEffect(() => {
      fetchSavedEvents(); 
    },[])

    const handleDelete = async (item) => {
      console.log('delete item with id: ', item.events.id);  // Use event_id or whatever unique ID you need to delete
  
      Alert.alert("Delete", "Are you sure you want to delete this event?", [
          { text: "Cancel", style: "cancel" },
          {
              text: "Delete",
              onPress: async () => {
                  const { error } = await supabase
                      .from("profile_events")
                      .delete()
                      .eq("event_id", item.event_id);  // Delete by event_id or the correct unique key
  
                  if (error) {
                      console.error("Error deleting event:", error);
                  } else {
                      fetchSavedEvents();  // Reload events after deletion
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
              onPress={() => handleDelete(item)}  // Pass the full item to handleDelete
          >
            
              <Text style={styles.deleteButtonText}><Ionicons name="trash-outline" size={18} color="white" /></Text>
          </Pressable>
      );
  };


  const renderSavedEventItem = ({ item }) => {

        console.log('on item', item);

        return (
            <Swipeable
                renderRightActions={(progress, dragX, id) =>
                    renderRightActions(progress, dragX, item)
                }
            >
                <Pressable
                    onPress={() =>
                        navigation.navigate('Event', { item: item.events, isSaved: true })
                    }
                >
                    
                    <View style={styles.conversationItem}>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                                uri: item.events.event_image ? item.events.event_image : 'https://via.placeholder.com/50/800080/FFFFFF',
                            }}
                         />
                        <View style={styles.outerTextContainer}>
                            <Image
                                source={{
                                    uri: item.events.event_image,
                                }}
                            />
                            <View style={styles.textContainer}>
                                {/* <Image src={item.events.event_image} /> */}
                                <Text style={styles.userName}>{item.events.event_name}</Text>
                                <Text>{item.events.description}</Text>
                                <Text>{item.events.event_location} - {new Date(item.events.start_date).toLocaleDateString()}</Text>
                                
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Swipeable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={savedEvents}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                keyExtractor={(item) => item?.events.id}
                renderItem={renderSavedEventItem}
                ListEmptyComponent={
                    <View style={styles.loadingContainer}>
                        <Text style={styles.title}>Loading events...</Text>
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
    tinyLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
});

export default MySavedEventList;