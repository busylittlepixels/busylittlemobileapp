import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
// import { Pressable } from 'react-native-gesture-handler';

const EventScreen = ({ navigation, route }:any) => {
    const { user, signOut } = useContext(AuthContext);
    const [ticket, setTicket] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    const { event_id } = route.params; // Get eventId from route params

    useEffect(() => {
        // console.log('event id?', event_id);
        const fetchTicket = async () => {
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .eq('event_id', event_id)
            .single();

          if (error) {
            // @ts-ignore
            setError(error.message);
          } else {
            // @ts-ignore
            setTicket(data);
          }
          setLoading(false);
        };
    
        fetchTicket();
      }, [event_id]);


    // console.log('ticket', ticket);

  const handleLogout = async () => {
    await signOut();
    navigation.replace('Login');
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
           
            <Text style={styles.title}>Event:</Text>
            <View style={styles.item}>
                {/* @ts-ignore */}
                <Text>Event ID: {ticket.event_id}</Text>
                {/* @ts-ignore */}
                <Text>Event Name: {ticket.event_name}</Text>
                {/* @ts-ignore */}
                <Text>Event Description: {ticket.event_description}</Text>
                {/* @ts-ignore */}
                <Button title="Buy Ticket" href={ticket.purchase_link} />
            </View>
          </>
        )}
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
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    top: 0,
  },
  item: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 12,
    paddingBottom: 12,
  },
  buttons: {
    // backgroundColor: 'cornflowerblue',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10, 
    alignItems: 'center',
    gap: 4,
    padding: 16
  },
});

export default EventScreen;
