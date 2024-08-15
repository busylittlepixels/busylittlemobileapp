import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import { ComponentConfig } from "@measured/puck";
import { spacingOptions } from "../../../options";

export type VerticalSpaceProps = {
  size: string;
};

// const VerticalSpace: ComponentConfig<VerticalSpaceProps> = {
//   label: "Vertical Space",
//   fields: {
//     size: {
//       type: "select",
//       options: spacingOptions,
//     },
//   },
//   defaultProps: {
//     size: "24px",
//   },
//   render: ({ size }) => {
//     return <div style={{ height: size, width: "100%" }} />;
//   },
// };

const VerticalSpace = ({ size }: { size: string; }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
       
        <Text>SIZE: {size}</Text>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full height of the screen
    flexDirection: 'row',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#f8f8f8', // Background color (optional)
  },
  // Centered view inside the container
  centeredView: {
    width: '100%', // Full width of the parent container
    backgroundColor: 'red', // Background color for the centered view
    padding: 20, // Padding inside the view
    // borderRadius: 8, // Optional: Rounded corners
    shadowColor: '#000', // Shadow color (optional for iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (optional for iOS)
    shadowOpacity: 0.2, // Shadow opacity (optional for iOS)
    shadowRadius: 4, // Shadow radius (optional for iOS)
    elevation: 5, // Shadow elevation (optional for Android)
  },
  // Text inside the centered view
  text: {
    textAlign: 'center', // Center text horizontally
    fontSize: 16, // Font size
    color: '#333', // Text color
  },
});


export { VerticalSpace };