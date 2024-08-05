import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext

const AccountScreen = ({ navigation }:any) => {
  const { user, signOut } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          // @ts-ignore
          setError(error.message);
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };

    getUserDetails();
  }, [user]);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase.from('tickets').select('*');
      if (error) {
        // @ts-ignore
        setError(error.message);
      } else {
                // @ts-ignore
        setTickets(data);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigation.replace('Login');
  };

  const letsSee = () => {
    console.log('tickets', tickets);
  };

  return (
    <View style={styles.main}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Account</Text>
        {user && (
          <>
            <Text>Email: {user.email}</Text>
            {/* @ts-ignore */}
            {profile && <Text>Full Name: {profile?.full_name}</Text>}
          </>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.innerContainer}>Events:</Text>
        <FlatList
          data={tickets}
          /* @ts-ignore */
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
               {/*  @ts-ignore  */}
              <Text style={styles.title}>{item.event_name}</Text>
                 {/*  @ts-ignore  */}
              <Text>{item.event_description}</Text>
              {/* @ts-ignore */}
              <TouchableOpacity onPress={() => navigation.navigate('Event', { event_id: item.event_id })} style={{ marginLeft: 10 }}><Text>View Event</Text></TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} />
        <Button title="Make Payment" onPress={() => navigation.navigate('Payment')} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttons: {
    // backgroundColor: 'cornflowerblue',
    display: 'flex',
    flexDirection: 'row',
    margin: 10, 
    alignItems: 'center',
    gap: 4,
    padding: 16
  },
});

export default AccountScreen;
