import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, Image, Platform, Pressable, Text, View, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import EventSignupForm from '../components/EventSignupForm';
import React from 'react';

export default function EventScreen({ navigation, route }:any) {

    useEffect(() => {
      navigation.setOptions({ title: route.params.item.event_name });
    }, [navigation]);
    
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{route.params ? route.params.item.event_name : 'Title'}</ThemedText>
      </ThemedView>
        <ThemedText>
            {route.params ? route.params.item.event_description : 'Body'}
        </ThemedText>

        
        
        <EventSignupForm />
        
        <View>
            <Button title="Back to List" onPress={() => navigation.navigate('Account')} />
        </View>
      {/* <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          //  @ts-expect-error
          style={styles.link}
          ><Text>Network</Text></Pressable>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> library
          to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  link: {
    color: '#ffffff'
  },
  buttons: {
    display: 'flex',
    left: 0,
  },
});



// import React, { useContext, useState, useEffect } from 'react';
// import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
// import { supabase } from '../../supabase'; // Make sure to import your Supabase client
// import { AuthContext } from '../context/AuthContext'; // Make sure to import your AuthContext
// // import { Pressable } from 'react-native-gesture-handler';

// const EventScreen = ({ navigation, route }:any) => {
//     const { user, signOut } = useContext(AuthContext);
//     const [ticket, setTicket] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [profile, setProfile] = useState(null);

//     const { event_id } = route.params; // Get eventId from route params

//     useEffect(() => {
//         // console.log('event id?', event_id);
//         const fetchTicket = async () => {
//         const { data, error } = await supabase
//             .from('tickets')
//             .select('*')
//             .eq('event_id', event_id)
//             .single();

//           if (error) {
//             // @ts-ignore
//             setError(error.message);
//           } else {
//             // @ts-ignore
//             setTicket(data);
//           }
//           setLoading(false);
//         };
    
//         fetchTicket();
//       }, [event_id]);


//     // console.log('ticket', ticket);

//   const handleLogout = async () => {
//     await signOut();
//     navigation.replace('Login');
//   };

//   return (
//     <View style={styles.main}>
//       <View style={styles.innerContainer}>
//         <Text style={styles.title}>Account</Text>
//         {user && (
//           <>
//             <Text>Email: {user.email}</Text>
//             {/* @ts-ignore */}
//             {profile && <Text>Full Name: {profile?.full_name}</Text>}
           
//             <Text style={styles.title}>Event:</Text>
//             <View style={styles.item}>
//                 {/* @ts-ignore */}
//                 <Text>Event ID: {ticket.event_id}</Text>
//                 {/* @ts-ignore */}
//                 <Text>Event Name: {ticket.event_name}</Text>
//                 {/* @ts-ignore */}
//                 <Text>Event Description: {ticket.event_description}</Text>
//                 {/* @ts-ignore */}
//                 <Button title="Buy Ticket" href={ticket.purchase_link} />
//             </View>
//           </>
//         )}
//       </View>
//       <View style={styles.buttons}>
//         <Button title="Update Details" onPress={() => navigation.navigate('UpdateDetails')} />
//         <Button title="Make Payment" onPress={() => navigation.navigate('Payment')} />
//         <Button title="Logout" onPress={handleLogout} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingRight: 16,
//     paddingLeft: 16,
//     top: 0,
//   },
//   item: {
//     // borderBottomWidth: 1,
//     // borderBottomColor: '#ccc',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//     paddingTop: 12,
//     paddingBottom: 12,
//   },
//   buttons: {
//     // backgroundColor: 'cornflowerblue',
//     display: 'flex',
//     flexDirection: 'row',
//     marginTop: 10, 
//     alignItems: 'center',
//     gap: 4,
//     padding: 16
//   },
// });

// export default EventScreen;
