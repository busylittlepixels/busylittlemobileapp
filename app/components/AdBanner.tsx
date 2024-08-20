import React from 'react'; 
import { View, Text, StyleSheet } from 'react-native'; 

const AdBanner = () => {
    return(
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>[ Advert Goes Here ]</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end', // Ensure the container takes up the full screen and places the section at the bottom
    },
    section: {
      position: 'relative',
      bottom: 0, // Position it at the bottom of the screen
      width: '100%', // Make it full width
      backgroundColor: 'gray', // Background color for the ad banner
      elevation: 5, // Add elevation to create a shadow (Android only)
      shadowColor: '#000', // Shadow properties for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      height: 100,
      alignItems: 'center', // Center children horizontally
      justifyContent: 'center', // Center children vertically
    },
    sectionTitle: {
      color: '#fff', // Change text color to white
      textAlign: 'center', // Center the text horizontally within the Text component
    },
  });

export default AdBanner;
