import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const AnimatedTabs = ({ state, descriptors, navigation }:any) => {
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(animatedValue.value * (width / state.routes.length), { duration: 250 }),
        },
      ],
    };
  });

  return (
    <View style={styles.tabBar}>
      <Animated.View style={[styles.indicator, animatedStyle]} />
      {/* @ts-ignore */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            animatedValue.value = index;
            navigation.navigate(route.name);
          }
        };

        // Determine the correct icon based on the route name
        let iconName;
        if (route.name === 'My Profile') {
          iconName = isFocused ? 'newspaper' : 'newspaper-outline';
        } else if (route.name === 'Settings') {
          iconName = isFocused ? 'settings' : 'settings-outline';
        } else if (route.name === 'Messages') {
          iconName = isFocused ? 'chatbox' : 'chatbox-outline';
        }

        return (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            {/* @ts-ignore */}
            <Ionicons name={iconName} size={24} color={isFocused ? 'green' : 'black'} />
            <Text style={{ color: isFocused ? 'green' : 'black' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    height: 3,
    width: width / 3, // Adjust based on the number of tabs
    backgroundColor: 'green',
    bottom: 0,
    left: 0, // Ensure it starts from the left
  },
});

export default AnimatedTabs;
