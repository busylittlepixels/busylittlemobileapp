// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet, Switch, Button, Alert, Pressable, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { setPublicProfile, setAdvertPreference, setNotificationsPreference } from '../../actions/settingsActions'; // Import the action
import { supabase } from "@/supabase";

const AcceptButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#90EE90' : 'green', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const RejectButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#000' : 'red', // Dim the color when pressed
        },
        styles.button,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const ScanButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#000' : 'gray', // Dim the color when pressed
        },
        styles.qrButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText} alt={title}><Ionicons name="camera-outline" size={28} color="white" /></Text>
    </Pressable>
  );
};

const MyCodeButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#000' : 'green', // Dim the color when pressed
        },
        styles.qrButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText} alt={title}><Ionicons name="qr-code-outline" size={24} color="white" /></Text>
    </Pressable>
  );
};


const MySettings = ({ navigation }: any) => {
  const [full_name, setFullname] = useState('');
  const [enableConnections, setEnableConnections] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]); // Changed to hold the pending requests
  const [refreshing, setRefreshing] = useState(false);
  const [userContacts, setUserContacts] = useState([])

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const showAdverts = useSelector((state: any) => state.settings.showAdverts);
  const showNotifications = useSelector((state: any) => state.settings.enablePushNotifications);
  const showPublic = useSelector((state: any) => state.settings.enablePublicProfile);

  console.log('showNotifications', showNotifications);


  const fetchContacts = async () => {
    // console.log('Fetching contacts...');
    
    // First, get the related user IDs from the contacts table
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('contact_user_id')  // Ensure this column exists in your 'contacts' table
      .eq('user_id', user.id);
  
    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      return; // Exit the function if there's an error
    }
  
    if (contacts && contacts.length > 0) {
      const relatedUserIds = contacts.map(contact => contact.contact_user_id);
      // console.log('Related user IDs:', relatedUserIds);
  
      // Now, fetch the profiles using the related user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', relatedUserIds); // Assuming 'id' is the primary key in the 'profiles' table
  
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      } else {
        setUserContacts(profiles);  // Set the profiles, not 'data'
        // console.log('Fetched profiles:', profiles);
      }
    } else {
      console.log('No contacts found.');
    }
  };
  

  const toggleAdverts = (value: boolean) => {
    // @ts-ignore
    dispatch(setAdvertPreference(value));
  };

  const togglePublic = (value: boolean) => {
    // @ts-ignore
    dispatch(setPublicProfile(value, user?.id));
  };

  const toggleNotifications = (value: boolean) => {
    // @ts-ignore
    dispatch(setNotificationsPreference(value, user?.id));
  };

  // Fetch pending connection requests where the current user is the receiver
  const fetchPendingRequests = async () => {
    const { data, error } = await supabase
      .from('connection_requests')
      .select(`
          id,
          sender:profiles!fk_sender(username, avatar_url),   
          receiver:profiles!fk_receiver(username, avatar_url)
      `)
      .eq('receiver_id', user?.id)  // Fetch requests where the current user is the receiver
      .eq('status', 'pending');      // Only pending requests

    if (error) {
      console.log('Error fetching pending requests:', error);
      Alert.alert('Error fetching pending requests');
    } else {
      setPendingRequests(data); // Store the pending requests
    }
  };


  // Handle accepting a connection request
  const acceptRequest = async (requestId: number) => {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) {
      Alert.alert('Error accepting request');
    } else {
      fetchPendingRequests(); // Refresh the pending requests after accepting
      Alert.alert('Connection request accepted');
    }
  };

  // Handle rejecting a connection request
  const rejectRequest = async (requestId: number) => {
    const { error } = await supabase
      .from('connection_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) {
      Alert.alert('Error rejecting request');
    } else {
      fetchPendingRequests(); // Refresh the pending requests after rejecting
      Alert.alert('Connection request rejected');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Sync data from AsyncStorage
    fetchPendingRequests().then(() => setRefreshing(false));

    setTimeout(() => {
      setRefreshing(false);
      // console.log('should refresh user details');
    }, 2000);
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchPendingRequests(); // Fetch pending requests when the component is mounted
    navigation.setOptions({ headerTitle: 'My Settings' });
  }, [navigation]);

  return (
    // <View style={styles.innerContainer}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.innerContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={[styles.title, { paddingVertical: 5 }]}>Connection Requests:</Text>
      <View>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <View key={request.id} style={styles.requestContainer}>
              <Text style={{ fontWeight: 'bold' }}>{request.sender.username}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                <AcceptButton title="Accept" onPress={() => acceptRequest(request.id)} />
                <RejectButton title="Reject" onPress={() => rejectRequest(request.id)} />
              </View>
            </View>
          ))
        ) : (
          <Text>No pending connection requests</Text>
        )}
      </View>

      <Text style={[styles.title, { paddingTop: 15, paddingBottom: 5 }]}>Public Settings:</Text>
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inlineLabel}>Enable Public Profile?</Text>
          <Switch
            value={showPublic}
            trackColor={{ true: 'green', false: 'gray' }}
            onValueChange={togglePublic}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inlineLabel}>Accept Connection Requests?</Text>
          <Switch
            value={enableConnections}
            trackColor={{ true: 'green', false: 'gray' }}
            onValueChange={setEnableConnections}
          />
        </View>
      </View>

      <Text style={[styles.title, { paddingTop: 15, paddingBottom: 5 }]}>Notifications:</Text>
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inlineLabel}>Enable Push Notifications?</Text>
          <Switch
            value={showNotifications}
            trackColor={{ true: 'green', false: 'gray' }}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>



      <Text style={[styles.title, { paddingVertical: 5 }]}>Advertising:</Text>
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inlineLabel}>Show Adverts</Text>
          <Switch
            value={showAdverts}
            trackColor={{ true: 'green', false: 'gray' }}
            onValueChange={toggleAdverts}
          />
        </View>
      </View>

      <Text style={[styles.title, { paddingVertical: 5 }]}>QR Codes:</Text>


      <View style={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%', position: 'relative', paddingVertical: 10 }}>
        <ScanButton title="Scan QR Code" onPress={() => navigation.navigate('Camera')} />
        <MyCodeButton title="My QR Code" onPress={() => navigation.navigate('MyQR')} />
      </View>

    </ScrollView>
    // </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  inputWrapperQR: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%'
    // justifyContent: 'center',  
  },
  inlineLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  qrButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 0,
    width: '50%'
  },
  buttonText: {
    color: 'white',
  }
});

export default MySettings;
