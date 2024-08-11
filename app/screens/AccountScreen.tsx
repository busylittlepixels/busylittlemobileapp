 // @ts-nocheck
 import React, { useContext, useState, useEffect, useCallback } from 'react';
 import { Alert, View, TextInput, Text, Button, FlatList, StyleSheet, ScrollView, Pressable } from 'react-native';
 import { supabase } from '../../supabase'; // Make sure to import your Supabase client
 import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
 import Toast from 'react-native-toast-message';
 import { useFocusEffect } from '@react-navigation/native';
 import HorizontalScroller from '../components/HorizontalScroller';
 import UserArticles from '../components/UserArticles';
 import Spacer from '../components/Spacer';
 
 const AccountScreen = ({ navigation }:any) => {
     const { user, signOut } = useContext(AuthContext);
     const [tickets, setTickets] = useState([]);
     const [username, setUsername] = useState([]);
     const [website, setWebsite] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [profile, setProfile] = useState(null);
   
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
   
     useEffect(() => {
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
   
       useFocusEffect(
         useCallback(() => {
           getUserDetails();
         }, [user, profile])
     );
 
     return (
         <ScrollView
           style={styles.scrollView}
           contentContainerStyle={styles.contentContainer}
           showsVerticalScrollIndicator={false}
         >
         {/* Section 1 */}
         <View style={styles.accountDetails}>
          <Text style={styles.sectionTitle}>Account:</Text>
          {user && (
            <>
              <View>
              {/* @ts-ignore */}
              <Text>Hey {profile?.username}</Text>
              <Text>Email: {user.email}</Text>
              </View>
            </>
          )}
         </View>
 
         {/* Section 2 */}
         <View style={styles.section}>
             <Text style={styles.sectionTitle}>Latest:</Text>
             <HorizontalScroller />
         </View>
 
         {/* Section 3 */}
         <View style={styles.section}>
             <Text style={styles.sectionTitle}>Events:</Text>
             <FlatList
                 data={tickets}
                 style={styles.eventsSection}
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
                      <Pressable onPress={() => navigation.navigate('Event', { item })} style={{ marginLeft: 10 }}><Text>View Event</Text></Pressable>
                     </View>
                 )}
                 />
         </View>
 
         {/* Section 4 */}
         <View style={styles.section}>
             <Text style={styles.articleSectionTitle}>Articles:</Text>
             <UserArticles navigation={navigation} userId={profile?.id}/>
         </View>
 

         {/* <View style={{ 'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'space-between'}}>
             <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} />
             <Button title="Favorites" onPress={() => navigation.navigate('FavoriteArticles')} />
             <Button title="Logout" onPress={handleLogout} />
         </View> */}
 
         </ScrollView>
     );
 };
 
 const styles = StyleSheet.create({
   scrollView: {
     flex: 1,
     backgroundColor: '#f0f0f0',
     // paddingTop: StatusBar.currentHeight || 20,
   },
   contentContainer: {
     // paddingHorizontal: 20,
     // paddingBottom: 20,
   },
   eventsSection: {
      backgroundColor: '#ffffff',
      padding: 0,
   },
   section: {
     // marginBottom: 20,
     padding: 20,
     backgroundColor: '#ffffff',
     // borderRadius: 10,
     // Shadow for iOS
     // shadowColor: '#000',
     // shadowOffset: { width: 0, height: 2 },
     // shadowOpacity: 0.8,
     // shadowRadius: 2,
     // Shadow for Android
     elevation: 5,
   },
   accountDetails: {
    padding: 20,
    backgroundColor: '#e1e1e1',
    // borderRadius: 10,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
   },
   item: {
    paddingVertical: 16,
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
  eventsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  articleSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sectionTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     marginBottom: 10,
   },
 });
 
 export default AccountScreen;
 