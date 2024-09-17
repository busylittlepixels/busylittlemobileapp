// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = async ({ type, data: scannedData }: any) => {
      setScanned(true);
      console.log(`Bar code with type ${type} and data ${scannedData} has been scanned!`);
      
      try {
        // Parse scanned data (assuming it's a JSON string)
        const parsedData = JSON.parse(scannedData);
        console.log('Parsed scanned data', parsedData);
  
        // Access properties from the parsed object
        const { id: scannedUserId, fullName, email, website } = parsedData;
  
        console.log(`Scanned user ID: ${scannedUserId}, Name: ${fullName}, Email: ${email}`);
  
        // Insert the contact into the Supabase 'contacts' table
        const { data: insertData, error } = await supabase
          .from('contacts')
          .insert([
            { user_id: user.id, contact_user_id: scannedUserId }
          ]);
  
        if (insertData) {
          console.log('Contact successfully inserted:', insertData);
        }
  
        if (error) {
          console.error('Error inserting contact:', error);
        }
      } catch (error) {
        console.error('Error parsing scanned data:', error);
      }
  };
  



    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
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
                    <View style={styles.overlay}>
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
        borderColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    overlayBottom: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
    },
});
