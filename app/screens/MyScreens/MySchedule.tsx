import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import EventsListItem from '../../components/EventsListItem';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const MySchedule = ({ navigation }:any) => {
    const item = {
      event_name: 'Test From Calendar',
      event_description: 'Test From Calendar',
    };
  
   
    return (
      <View style={styles.innerContainer}>
        <Text style={[styles.title, { paddingBottom: 5 }]}>Upcoming Events:</Text>
        <Text style={[styles.title, { paddingBottom: 5 }]}>[Filters HERE]</Text>
        <Calendar
          onDayPress={(day: any) => navigation.navigate('Event', { item })}
          onDayLongPress={(day: any) => console.log('onDayLongPress', day)}
          onMonthChange={(date: any) => console.log('onMonthChange', date)}
          onPressArrowLeft={(goToPreviousMonth: () => void) => {
            console.log('onPressArrowLeft');
            goToPreviousMonth();
          }}
          onPressArrowRight={(goToNextMonth: () => void) => {
            console.log('onPressArrowRight');
            goToNextMonth();
          }}
        />
      </View>
    );
  };


const styles = StyleSheet.create({
    main: {
      flex: 1,
    },
    label: {
      paddingTop: 10,
      fontWeight: 'bold',
    },
    formContainer: {
      flex: 3,
      // marginTop: 10,
    },
    innerContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingRight: 16,
      paddingLeft: 16,
      marginTop: 10,
    },
    inputStyle: {
      marginTop: 10,
      backgroundColor: 'lightgray',
      borderWidth: 1,
      color: '#000',
      padding: 10,
      borderRadius: 3,
    },
    selectedCity: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 2,
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
    },
    title: {
      fontWeight: 'bold',
      marginVertical: 5,
      fontSize: 18,
    },
    button: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 0,
      width: '50%'
    },
    buttonText: {
      color: '#FFFFFF', // White text
      fontSize: 16,
      fontWeight: 'normal',
    },
    profileHeader:{
      paddingVertical: 20,
      paddingHorizontal: 15, 
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderRadius: 3, 
      marginBottom: 5
    },
    inputWrapper: {
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Center items vertically
      backgroundColor: 'lightgray',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      justifyContent: 'space-between'
    },
    
    inlineLabel: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 14,
      marginRight: 10, // Space between label and input
    },
    innerWrapperInputStyle: {
      flex: 1, // Take up the remaining space
      textAlign: 'right', // Align text to the right
      color: '#000',
      fontSize: 14,
    },
  });
  
  
  
  export default MySchedule; 