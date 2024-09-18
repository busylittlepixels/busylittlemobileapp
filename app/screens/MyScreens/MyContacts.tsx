import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from "@/supabase";

const AcceptButton = ({ title, onPress }:any) => (
  <Pressable
    style={({ pressed }) => [
      {
        backgroundColor: pressed ? '#90EE90' : 'green',
      },
      styles.qrButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const RejectButton = ({ title, onPress }:any) => (
  <Pressable
    style={({ pressed }) => [
      {
        backgroundColor: pressed ? '#000' : 'red',
      },
      styles.qrButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const ScanButton = ({ title, onPress }:any) => (
  <Pressable
    style={({ pressed }) => [
      {
        backgroundColor: pressed ? '#000' : 'gray',
      },
      styles.qrButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>
      <Ionicons name="qr-code-outline" size={24} color="white" />
    </Text>
  </Pressable>
);

const MyContacts = ({ navigation }:any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userContacts, setUserContacts] = useState([]);

  // @ts-ignore
  const user = useSelector((state) => state.auth.user);

  const fetchContacts = async () => {
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('contact_user_id')
      .eq('user_id', user.id);

    if (contactsError) {
      // Handle error if necessary
      return;
    }

    if (contacts && contacts.length > 0) {
      const relatedUserIds = contacts.map(contact => contact.contact_user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', relatedUserIds);

      if (profilesError) {
        // Handle error if necessary
      } else {
        // @ts-ignore
        setUserContacts(profiles);
      }
    } else {
      setUserContacts([]);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: true, // Ensures the back button text is visible
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
          <Pressable onPress={() =>  navigation.navigate('Camera')}>
            <Ionicons name="camera-outline" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [navigation])
  );

  return (
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
            {userContacts.length > 0 ? (
              userContacts.map((c) => (
                // @ts-ignore
                <View key={c.id} style={{ marginBottom: 10 }}>
                  {/* @ts-ignore */}
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{c.full_name}</Text>
                  <Text>company: BusyLittlePixels</Text>
                  <Text>job title: CTO</Text>
                  {/* @ts-ignore */}
                  <Text>email: {c.email}</Text>
                  {/* @ts-ignore */}
                  <Text>website: {c.website}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noContactsContainer}>
                <Text style={styles.noContactsText}>No contacts found.</Text>
                <ScanButton title="Scan your first code" onPress={() => navigation.navigate('Camera')} />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
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
  noContactsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noContactsText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  qrButton: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 0,
    width: '50%',
  },
  buttonText: {
    color: 'white',
  },
});

export default MyContacts;
