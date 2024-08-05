import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { supabase } from '@/supabase';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Account'>;

interface Props {
  navigation: AccountScreenNavigationProp;
}

interface Ticket {
    id: string;
    event_name: string;
    event_description: string;
// Add other fields as necessary
}

const AccountScreen = ({ navigation }: Props) => {
  const { user, signOut } = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase.from('tickets').select('*');
      if (error) {
        setError(error.message);
      } else {
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
    console.log('tickits', tickets); 
  }


  return (
    <View style={styles.container}>
        <View style={styles.innerContainer}>
            <Text style={styles.title}>Account</Text>
            {user && (
                <>
                <Text>Email: {user.email}</Text>
                {/* @ts-ignore */}
                <Text>Username: {user ? user?.username : 'test'}</Text>
                {/* @ts-ignore */}
                <Text>Full Name: {user ? user?.full_name : 'tickles'}</Text>
                {/* Display other user details as necessary */}
                </>
            )}
      </View>
      <View style={styles.container}>
        <Text style={styles.innerContainer}>Events:</Text>
        <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.item}>
                <Text style={styles.title}>{item.event_name}</Text>
                <Text>{item.event_description} Teacs</Text>
            </View>
            )}
        />
        </View>
      <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} />
      <Button title="Make Payment" onPress={() => navigation.navigate('Payment')} />
      <Button title="Logout" onPress={() => handleLogout()} />
        <Button title="test" onPress={() => letsSee()} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 16,
      paddingBottom: 16,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 16,
        paddingRight: 16, 
        paddingLeft: 16,
        paddingBottom: 0,
    },    
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000'
    },
  });
  
export default AccountScreen;
