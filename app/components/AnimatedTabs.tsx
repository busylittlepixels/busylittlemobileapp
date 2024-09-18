import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const AnimatedTabs = forwardRef(({ state, descriptors, navigation, unreadMessagesCount }: any, ref) => {
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

  useEffect(() => {
    animatedValue.value = state.index;
  }, [state.index]);

  useImperativeHandle(ref, () => ({
    setTabIndex: (index: number) => {
      animatedValue.value = index;
    },
  }));

  return (
    <View style={styles.tabBar}>
      <Animated.View style={[styles.indicator, animatedStyle]} />
      {state.routes.map((route: { key: string | number; name: string }, index: React.Key | null | undefined) => {
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
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === 'My Profile') {
          iconName = isFocused ? 'newspaper' : 'newspaper-outline';
        } else if (route.name === 'Settings') {
          iconName = isFocused ? 'settings' : 'settings-outline';
        } else if (route.name === 'Messages') {
          iconName = isFocused ? 'chatbox' : 'chatbox-outline';
        } else if (route.name === 'MyContacts') {
          iconName = isFocused ? 'people' : 'people-outline';
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
            <View style={{ position: 'relative' }}>
              {/* @ts-ignore */}
              <Ionicons name={iconName} size={24} color={isFocused ? 'green' : 'black'} />
              {route.name === 'Messages' && unreadMessagesCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
                </View>
              )}
            </View>
            <Text style={{ color: isFocused ? 'green' : 'black' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

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
    width: width / 4, // Adjust based on the number of tabs
    backgroundColor: 'green',
    bottom: 0,
    left: 0,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AnimatedTabs;