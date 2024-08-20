import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserAvatar from './UserAvatar';

const ParallaxScrollAvatar = ({ imageUrl, name }: any) => {
  return (
    <View style={styles.avatarContainer}>
      <UserAvatar imageUrl={imageUrl} name={name} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 50, // Set the desired width of the avatar
    height: 50, // Set the desired height of the avatar
    // borderRadius: 50, // Half the width/height to make it circular
    // overflow: 'hidden', // Ensures the avatar image doesn't overflow
    marginRight: 20, // Adds some space between the text and the avatar
    marginBottom: 20
  },
});

export default ParallaxScrollAvatar;
