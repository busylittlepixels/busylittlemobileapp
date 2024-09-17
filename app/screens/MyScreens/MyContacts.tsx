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
      <Text style={styles.buttonText} alt={title}><Ionicons name="qr-code-outline" size={24} color="white" /></Text>
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
      <Text style={styles.buttonText} alt={title}><Ionicons name="camera-outline" size={28} color="white" /></Text>
    </Pressable>
  );
};


const MyContacts = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userContacts, setUserContacts] = useState([])

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
 

  const fetchContacts = async () => {   
    // First, get the related user IDs from the contacts table
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('contact_user_id')  // Ensure this column exists in your 'contacts' table
      .eq('user_id', user.id);
  
    if (contactsError) {
    //   console.error('Error fetching contacts:', contactsError);
      return; // Exit the function if there's an error
    }
  
    if (contacts && contacts.length > 0) {
      const relatedUserIds = contacts.map(contact => contact.contact_user_id);
    //   console.log('Related user IDs:', relatedUserIds);
  
      // Now, fetch the profiles using the related user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', relatedUserIds); // Assuming 'id' is the primary key in the 'profiles' table
  
      if (profilesError) {
        // console.error('Error fetching profiles:', profilesError);
      } else {
        setUserContacts(profiles);  // Set the profiles, not 'data'
        // console.log('Fetched profiles:', profiles);
      }
    } else {
      console.log('No contacts found.');
    }
  };
  

//   console.log('userContacts', userContacts)


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Sync data from AsyncStorage
    fetchContacts().then(() => setRefreshing(false));

    setTimeout(() => {
      setRefreshing(false);
      // console.log('should refresh user details');
    }, 2000);
  }, []);

  useEffect(() => {
    fetchContacts();
    navigation.setOptions({ headerTitle: 'My Contacts' });
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
           
        <View>
        <Text style={[styles.title, { paddingVertical: 5 }]}>Scanned Contacts:</Text>
          <View>
            <View style={styles.inputWrapper}>
              {userContacts ? userContacts.map((c) => (
                <View key={c.id} style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18}}>{c.full_name}</Text>
                    <Text>company: BusyLittlePixels</Text>
                    <Text>job title: CTO</Text>
                    <Text>email: {c.email}</Text>
                    <Text>website: {c.website}</Text>
                </View>
               )) : <Text>Loading scanned contacts</Text>}
            </View>
          </View>
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
    flexDirection: 'column',
    marginVertical: 10,
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

export default MyContacts;
