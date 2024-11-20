// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser, useSignOutMutation } from "../../services/auth/authApi";
import Toast from 'react-native-toast-message';


const ScanButton = ({ title, onPress }:any) => (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? '#000' : 'gray',
        },
        styles.qrButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        <Ionicons name="qr-code-outline" size={24} color="white" />
      </Text>
    </Pressable>
);

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const user = useSelector(selectCurrentUser);



    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = async ({ type, data: scannedData }: any) => {
     
      console.log(`Bar code with type ${type} and data ${scannedData} has been scanned!`);
      setScanned(true);
      try {
        // Parse scanned data (assuming it's a JSON string)
        const parsedData = JSON.parse(scannedData);
        // Access properties from the parsed object
        const { id: scannedUserId, fullName, email, website } = parsedData;
        // Insert the contact into the Supabase 'contacts' table
        const { data: insertData, error } = await supabase
          .from('contacts')
          .insert([
            { user_id: user.id, contact_user_id: scannedUserId }
          ]);
  
        if (insertData) {
          console.log('Contact successfully inserted:', insertData);
         
          alert('Contact added successfully!')
        }
  
        if (error) {
            console.error('Error inserting contact:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add contaact. Please try again.',
            });
        } else {
            Toast.show({
                type: 'success',
                text1: 'BOOM!',
                text2: 'Contact added successfully.',
            });
        }
      } catch (error) {
        console.error('Error parsing scanned data:', error);
      }
  };
  



    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return (
        <View style={[styles.container, {alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>No access to camera</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
            >
                {/* Added the overlay */}
                <View style={styles.overlayTop} />
                <View style={styles.overlayMiddle}>
                    <View style={styles.overlaySide} />
                    <View style={scanned ? styles.overlayScanned : styles.overlay }>
                        <Text style={styles.overlayText}>Align QR code within the frame</Text>
                    </View>
                    <View style={styles.overlaySide} />
                </View>
                <View style={styles.overlayBottom} />
            </CameraView>
            {scanned && (
                <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    // Darkened overlay styles
    overlayTop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
    },
    overlayMiddle: {
        flexDirection: 'row',
    },
    overlaySide: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
    },
    overlay: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'green', // Green border when scanning
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    overlayScanned: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'red', // Red border when scanned
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        zIndex: 1,
    },
    overlayBottom: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
    },
    qrButton: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 0,
        width: '50%'
    },
});
