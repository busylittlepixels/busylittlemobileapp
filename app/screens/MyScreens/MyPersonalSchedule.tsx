// @ts-nocheck
import React, {useRef, useEffect, useCallback, useState} from 'react';
import {StyleSheet, RefreshControl} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import testIDs from '../../components/testIds';
// @ts-ignore
import { getMarkedDates } from '../../components/agendaItems';
import AgendaItem from '../../components/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../../components/theme';
import { useSelector } from 'react-redux';
import { supabase } from '../../../supabase';

const leftArrowIcon = require('../../assets/images/previous.png');
const rightArrowIcon = require('../../assets/images/next.png');

interface Props {
  weekView?: boolean;
}

export interface User {
  id: string;
}

const formatScheduleToAgendaItems = (schedule) => {
  if (!schedule || schedule.length === 0) {
    return [];
  }

  const agendaMap = schedule.reduce((acc, event) => {
    const rawStartDate = event.events.start_date;
    const parsedDate = new Date(rawStartDate);
    console.log('Raw start_date:', rawStartDate);
    // Check if the date is valid
    if (isNaN(parsedDate)) {
      console.error('Invalid Date:', rawStartDate);  // Log the invalid date for debugging
      return acc;  // Skip this event if date is invalid
    }

    const eventDate = parsedDate.toLocaleDateString();
    const eventStartTime = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const eventData = {
      hour: eventStartTime,
      duration: '1h',  // You can calculate the actual duration if available
      title: event.events.event_name, 
      
    };

    // Add event data to the correct date group
    if (!acc[eventDate]) {
      acc[eventDate] = { title: eventDate, data: [eventData] };
    } else {
      acc[eventDate].data.push(eventData);
    }

    return acc;
  }, {});



  return Object.values(agendaMap);
};

const MyPersonalSchedule = (props: Props) => {
  const user = useSelector((state) => state.auth.user);
  const [schedule, setSchedule] = useState([]);  // Initialize schedule as an empty array
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);  // Add refreshing state
  const defaultDate = new Date().toISOString().split('T')[0]; // Get today's date

  const fetchUserSchedule = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const { data: scheduleEvents, error: scheduleError } = await supabase
        .from('profile_events')
        .select('*, events(*)')
        .eq('profile_id', user.id);

      if (scheduleError) throw new Error(scheduleError.message);
      setSchedule(scheduleEvents || []); // Set the schedule or empty array
    
    } catch (err) {
      console.error('Failed to fetch schedule events:', err.message);
    } finally {
      setRefreshing(false);  // Stop refreshing when data is fetched
    }
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);  // Set refreshing state to true
    fetchUserSchedule();   // Trigger the fetch function
  }, [fetchUserSchedule]);

  const { weekView } = props;
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({ todayButtonTextColor: themeColor });

  const onDateChanged = useCallback((date, updateSource) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  }, []);

  const onMonthChange = useCallback(({ dateString }) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  useEffect(() => {
    fetchUserSchedule();
  }, [fetchUserSchedule]);

  useEffect(() => {
    if (schedule.length > 0) {
      setMarkedDates(getMarkedDates(schedule));
    }
  }, [schedule]);

  const agendaItems = formatScheduleToAgendaItems(schedule);
  const ITEMS: any[] = agendaItems.length > 0 ? agendaItems : [{ title: defaultDate, data: [] }];

  return (
    <CalendarProvider
      date={ITEMS[0]?.title || defaultDate} // Use defaultDate if ITEMS[0] is undefined
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar
          testID={testIDs.weekCalendar.CONTAINER}
          firstDay={1}
          markedDates={markedDates}
        />
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          theme={theme.current}
          firstDay={1}
          markedDates={markedDates}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          animateScroll
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />  // Add RefreshControl here
        }
      />
    </CalendarProvider>
  );
};

export default MyPersonalSchedule;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});
