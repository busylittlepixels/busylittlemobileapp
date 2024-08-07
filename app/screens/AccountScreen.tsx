import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, TextInput, Text, Button, FlatList, StyleSheet, Pressable } from 'react-native';
import { supabase } from '../../supabase'; // Make sure to import your Supabase client
import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
import Toast from 'react-native-toast-message';

const AccountScreen = ({ navigation }:any) => {
  const { user, signOut } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [username, setUsername] = useState([]);
  const [website, setWebsite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      if (user && user.id) {
        const { data, error } = await supabase.from('profiles')
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


  const handleUpdate = async () => {
    
    if(!username){
      Toast.show({
        type: 'error',
        text1: 'Derp',
        text2: 'You can\`t have an emptry username',
        
      });
    }
    // @ts-ignore
    const updatedProfile = {...profile, username};
    console.log('updated profile', updatedProfile);
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      // @ts-ignore
      .eq('id', user.id)
  
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'FUCK',
        text2: 'Something done gone fucked up.' + error.message,
        
      });
      
    } else {
      // console.log('Profile updated successfully:');
      setProfile(updatedProfile);
      Toast.show({
        type: 'success',
        text1: 'FUCK YEAH! Updated Yo!',
      });
    }
    // @ts-ignore
    // setUsername('');

  };


  return (
    <View style={styles.main}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Account</Text>
        {user && (
          <>
            <Text>Email: {user.email}</Text>
            <View>
            {/* @ts-ignore */}
            {/* <Text>Full Name: {profile?.full_name}</Text> */}
             {/* @ts-ignore */}
             {/* {profile?.website ? <Text>Website: {profile?.website}</Text> : null} */}
             {/* @ts-ignore */}
            <Text>Username: {profile?.username}</Text>
            </View>
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
              <View>
               {/*  @ts-ignore  */}
              <Text style={styles.title}>{item.event_name}</Text>
                 {/*  @ts-ignore  */}
              <Text>{item.event_description}</Text>
              </View>
              {/* @ts-ignore */}
              <Pressable onPress={() => navigation.navigate('Event', { event_id: item.event_id })} style={{ marginLeft: 10 }}><Text>View Event</Text></Pressable>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  inputStyle: {
    marginTop: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    color: '#000',
    padding: 10
  }
});

export default AccountScreen;
