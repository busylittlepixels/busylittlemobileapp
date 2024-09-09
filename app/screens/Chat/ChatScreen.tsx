// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../../supabase';  // Ensure supabase is properly initialized

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface RouteParams {
  route: {
    params: {
      senderId: string;
      receiverId: string;
    };
  };
}

const ChatScreen = ({ navigation, route }: RouteParams) => {
  const { senderId, receiverId } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: route.params?.otherUserName });
  }, [navigation]);

  // Fetch existing chat messages between the two users
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data as Message[]);
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch initial messages when component mounts

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new;
        // Check if the new message belongs to this conversation
        if ((newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
            (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      })
      .subscribe();

    // Cleanup the subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [senderId, receiverId]);

  // Function to send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const { error } = await supabase
        .from('messages')
        .insert([
          { message: newMessage, sender_id: senderId, receiver_id: receiverId }
        ]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setNewMessage(''); // Clear the input field after sending
      }
    }
  };

  // Render each message
  const renderItem = ({ item }: { item: Message }) => (
    <View style={item.sender_id === senderId ? styles.sentMessage : styles.receivedMessage}>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Chat Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        // inverted // Display newest messages at the bottom
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} // Stick the list to the bottom
      />

      {/* Message Input and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
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
