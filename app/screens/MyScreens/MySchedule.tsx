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
      <View style={styles.container}>
        
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
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'white',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      marginLeft: 20,
    },
  });
  
  
  export default MySchedule; 