// @ts-nocheck
import React, {useRef, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import testIDs from '../../components/testIds';
// @ts-ignore
import { agendaItems, getMarkedDates } from '../../components/agendaItems';
import AgendaItem from '../../components/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../../components/theme';

const leftArrowIcon = require('../../assets/images/previous.png');
const rightArrowIcon = require('../../assets/images/next.png');
const ITEMS: any[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const MyPersonalSchedule = (props: Props) => {
  const {weekView} = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const onDateChanged = useCallback((date, updateSource) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  }, []);

  const onMonthChange = useCallback(({dateString}) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item}/>;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current}/>
      ) : (
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          animateScroll
          // closeOnDayPress={false}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        // scrollToNextEvent
        sectionStyle={styles.section}
        // dayFormat={'yyyy-MM-d'}
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