import React from 'react';
import { SafeAreaView, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const AccountScreen = ({ route, navigation }:any) => {
    const { email } = route.params ? route.params : { email: 'test@cock.cc' };
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>My Account Screen</Text>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Welcome back { email && email }</ThemedText>
                <ThemedText>
                When you're ready, run{' '}
                <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
                <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
                <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
                <ThemedText type="defaultSemiBold">app-example</ThemedText>.
                </ThemedText>
            </ThemedView>
            <TouchableOpacity><Button title="Edit" onPress={() => navigation.navigate('Home')} /></TouchableOpacity>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        margin: 8,
        padding: 8,

    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontWeight: 'black',
    },
    dataContainer: {
        padding: 10,
    },
        
});

export default AccountScreen;
