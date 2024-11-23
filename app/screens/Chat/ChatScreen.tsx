// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Image } from 'react-native';
import { supabase } from '../../../supabase';  // Ensure supabase is properly initialized
import { sendMessage } from '../../actions/messageActions'; // Import the logout action if needed

const SendButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#0b6623' : 'green',
          padding: 5,
          borderRadius: 5 // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
       <Text style={styles.buttonText}><Ionicons name={'chevron-forward-circle-outline'} size={24} color={'white'} /></Text>
    </Pressable>
  );
};

const AtttachmentButton = ({ icon, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
    >
      <Ionicons name={`${icon}-outline`} size={24} color="black" />
    </Pressable>
  );
};




const ChatScreen = ({ navigation, route }) => {
  const { senderId, receiverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);  // FlatList ref to handle scrolling
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigateToUserProfile = () => {
    console.log('params', route.params.otherUserEmail)
    navigation.navigate('FriendProfile', route.params.sender_id)
    navigation.navigate('FriendProfile', { user: { id: route.params.senderId, name: route.params.otherUserName, full_name: route.params.otherUserName, avatar: route.params.otherUserAvatar, email: route.params.otherUserEmail }  });
  }

  useEffect(() => {
    navigation.setOptions({ 
      headerTitle: () => (
        <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', gap: 2, paddingVertical: '5px' }}>
          <Pressable
              onPress={navigateToUserProfile}
            >
            <Image
              source={{ uri: route.params?.otherUserAvatar || 'https://via.placeholder.com/50' }} // Fallback to a placeholder if no avatar
              style={{ width: 30, height: 50, borderRadius: 20, paddingVertical: 10, marginRight:5 }} // Style for the avatar image
            />
          </Pressable>
          
          <Text style={{ fontWeight: 'bold' }}>{route.params?.otherUserName}</Text>
        </View>
    ),
  });
  }, [navigation]);


 

  const handleAttachment = (icon) =>{
    console.log('icon: ' + icon + ' clicked');
  } 


  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
      // dispatch(sendMessage);
    }

    markMessagesAsRead(); // Mark messages as read after fetching
  };

  const markMessagesAsRead = async () => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true }) // Set the read field to true
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .eq('read', false); // Only update unread messages

    if (error) {
      console.error('Error marking messages as read:', error);
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
          setMessages((prevMessages) => [...prevMessages, newMessage]);
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

      const { error } = await supabase
        .from('messages')
        .insert([{ message: newMessage, sender_id: senderId, receiver_id: receiverId, read: false }]); // Insert a new message with read: false

      if (error) {
        console.error('Error sending message:', error);
      } else {
        
        setNewMessage('');
      }

      setLoading(false);
    }
  };

  // Scroll to the last message after messages load or when new messages are added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      const lastIndex = messages.length - 1;  // Last index in the messages array
      if (lastIndex >= 0) {
        setTimeout(() => {
          flatListRef?.current?.scrollToIndex({ index: lastIndex, animated: true });
        }, 100);
      }
    }
  }, [messages]);  // This runs both when the messages load initially and when a new message is added

  // getItemLayout helps FlatList know the height of each item in the list
  const getItemLayout = (data, index) => ({
    length: 70,  // Approximate height of each message item (adjust to fit your design)
    offset: 70 * index,
    index
  });

  // Handle scroll failure when index is out of range or not rendered yet
  const onScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500)); // Wait for 500ms
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const renderItem = ({ item }) => (
    <View style={item.sender_id === senderId ? styles.sentMessage : styles.receivedMessage}>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
        contentContainerStyle={{ flexGrow: 1 }}
        initialNumToRender={10}
        windowSize={21}
        getItemLayout={getItemLayout}  // Provide item layout info to FlatList
        onScrollToIndexFailed={onScrollToIndexFailed}  // Handle failures to scroll
        
        // Scroll directly to the bottom when the FlatList loads
        initialScrollIndex={messages.length > 0 ? messages.length - 1 : 0}  // This ensures that the FlatList starts at the last message on load

        onContentSizeChange={() => {
          const lastIndex = messages.length - 1;
          if (lastIndex >= 0) {
            flatListRef.current?.scrollToIndex({ index: lastIndex, animated: true });
          }
        }}  // Scroll to the last message when content size changes
      />

        <View style={styles.inputContainer}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 8, gap: 4 }}>
            <AtttachmentButton onPress={() => handleAttachment('camera')} icon={'camera'}/>
            <AtttachmentButton onPress={() => handleAttachment('attachment')} icon={'attach'}/>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline={true}  // Allows text input to grow vertically if needed
          />
          <SendButton title="Send" onPress={handleSendMessage} disabled={loading} />
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
    padding: 9,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
