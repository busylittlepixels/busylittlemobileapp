import React from 'react'; 
import { View, Text, StyleSheet, Image } from 'react-native'; 

const AdBanner = ({ color, image, text, subtitle }: any) => {
  const col = color ? color : 'transparent';
  
  return (
    
    <View style={styles.container}>
      <Image 
        source={{ uri: image }} 
        style={[styles.image, { backgroundColor: col }]} // Background color for visibility
        resizeMode="cover" 
        onError={(error) => console.log('Image failed to load', error.nativeEvent.error)} 
      />
      <View style={styles.overlay}>
        <Text style={styles.sectionTitle}>{text ? text : '[ Advert Goes Here ]'}</Text>
        <Text style={styles.subTitle}>{subtitle ? subtitle : "Did you know you can use car oil to fertilize your lawn?"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 100,
  },
  image: {
    width: '100%', 
    height: '100%', 
    position: 'absolute', // Make the image fill the entire container
  },
  overlay: {
    position: 'absolute', // Position the text overlay on top of the image
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  sectionTitle: {
    color: '#fff', // Set text color to white
    fontSize: 18, // Adjust font size as needed
    fontWeight: 'bold', // Make text bold
    textAlign: 'center', // Center the text
  },
  subTitle:{
    color: '#fff', // Set text color to white
    fontSize: 12, // Adjust font size as needed
    fontWeight: 'normal', // Make text bold
    textAlign: 'center', // Center the text
  }
});

export default AdBanner;
