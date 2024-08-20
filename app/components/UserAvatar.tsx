import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserAvatar = ({ imageUrl, name }: any) => {
  const navigation = useNavigation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Profile'); // Navigate to UpdateDetailsScreen when pressed
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.avatarContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>{getInitials(name)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 75,
    height: 75,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#CCCCCC', // Fallback color when there's no image
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF', // Background color for initials
    width: '100%',
    height: '100%',
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default UserAvatar;
