import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Pressable
} from 'react-native';
import ParallaxScrollView from '@/app/components/ParallaxScrollView';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
const { height } = Dimensions.get('window');
const ITEM_HEIGHT = height * 0.5;

const TabEileScreen = ({ navigation, route }:any) => {

  // console.log('def', route.params);

  useEffect(() => {
    navigation.setOptions({ title: route.params?.item?.name });
  }, [navigation]);

  const triggerRefresh = async () => {
    console.log('fuck yourself')
  }

  useEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false, // Ensures the back button text is visible
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
          <Pressable onPress={triggerRefresh}>
            <Ionicons name="refresh-outline" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const { item } = route.params;
  // console.log('tab eile, rud eile', item.uri);
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>
      <ParallaxScrollView
        // @ts-ignores
        headerBackgroundColor="#353636"
        backgroundColor="#353636"
        contentBackgroundColor="#353636"
        headerImage={
           <Image
           source={{ uri: item.uri }}
           style={{
             width: '100%',
             height: ITEM_HEIGHT,
             // borderBottomLeftRadius: 20,
             // borderBottomRightRadius: 20
           }}
           resizeMode='cover'
         />
        }
      >
     
      {/* <MaterialCommunityIcons
        name='close'
        size={28}
        color='#fff'
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          zIndex: 2
        }}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
      <View
        style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 20 }}
      >
        <SimpleLineIcons size={40} color='white' name={item.iconName} />
        <View style={{ flexDirection: 'column', paddingLeft: 6 }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
              lineHeight: 28
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              lineHeight: 18
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>
      <ScrollView
        indicatorStyle='white'
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#0f0f0f'
        }}
        contentContainerStyle={{ paddingVertical: 20 }}
      >
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            lineHeight: 24,
            marginBottom: 4
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            lineHeight: 24,
            marginBottom: 4
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </ParallaxScrollView>
    </View>
  );
};
export default TabEileScreen;