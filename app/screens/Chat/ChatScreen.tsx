// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../../supabase';  // Ensure supabase is properly initialized

const ChatScreen = ({ navigation, route }) => {
  const { senderId, receiverId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: route.params?.otherUserName });
  }, [navigation]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data.reverse() || []);  // Reverse the messages to load from the bottom
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages in real-time
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        if ((newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
            (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)) {
          setMessages((prevMessages) => [newMessage, ...prevMessages]);  // Prepend new message
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [senderId, receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      setLoading(true);

      // Send message to Supabase
      const { error } = await supabase
        .from('messages')
        .insert([{ message: newMessage, sender_id: senderId, receiver_id: receiverId }]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage(''); // Clear input field
      }

      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender_id === senderId ? styles.sentMessage : styles.receivedMessage}>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          inverted={true}  // Invert the list to load from the bottom
          contentContainerStyle={{ flexGrow: 1 }}
          initialNumToRender={10}
          windowSize={21}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <Button title="Send" onPress={handleSendMessage} disabled={loading} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  receivedMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ECECEC',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ChatScreen;
