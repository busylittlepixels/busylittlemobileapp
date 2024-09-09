// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { setPublicProfile, setAdvertPreference } from '../../actions/settingsActions'; // Import the action
import { supabase } from "@/supabase";

const MySettings = ({ navigation }: any) => {
    const [full_name, setFullname] = useState('');
    const [enableConnections, setEnableConnections] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]); // Changed to hold the pending requests

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const showAdverts = useSelector((state: any) => state.settings.showAdverts);
    const showPublic = useSelector((state: any) => state.settings.enablePublicProfile);

    const toggleAdverts = (value: boolean) => {
        // @ts-ignore
        dispatch(setAdvertPreference(value));
    };

    const togglePublic = (value: boolean) => {
        // @ts-ignore
        dispatch(setPublicProfile(value, user?.id));
    };

    // Fetch pending connection requests where the current user is the receiver
    const fetchPendingRequests = async () => {
        const { data, error } = await supabase
            .from('connection_requests')
            .select(`
                id,
                sender:profiles!fk_sender(username, avatar_url),   
                receiver:profiles!fk_receiver(username, avatar_url)
            `)
            .eq('receiver_id', user?.id)  // Fetch requests where the current user is the receiver
            .eq('status', 'pending');      // Only pending requests
    
        if (error) {
            console.log('Error fetching pending requests:', error);
            Alert.alert('Error fetching pending requests');
        } else {
            setPendingRequests(data); // Store the pending requests
        }
    };
    

    // Handle accepting a connection request
    const acceptRequest = async (requestId: number) => {
        const { error } = await supabase
            .from('connection_requests')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        if (error) {
            Alert.alert('Error accepting request');
        } else {
            fetchPendingRequests(); // Refresh the pending requests after accepting
            Alert.alert('Connection request accepted');
        }
    };

    // Handle rejecting a connection request
    const rejectRequest = async (requestId: number) => {
        const { error } = await supabase
            .from('connection_requests')
            .update({ status: 'rejected' })
            .eq('id', requestId);

        if (error) {
            Alert.alert('Error rejecting request');
        } else {
            fetchPendingRequests(); // Refresh the pending requests after rejecting
            Alert.alert('Connection request rejected');
        }
    };

    useEffect(() => {
        fetchPendingRequests(); // Fetch pending requests when the component is mounted
        navigation.setOptions({ headerTitle: 'My Settings' });
    }, [navigation]);

    return (
        <View style={styles.innerContainer}>
            <Text style={[styles.title, { paddingVertical: 5 }]}>Connection Requests:</Text>
            <View>
                {pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => (
                        <View key={request.id} style={styles.requestContainer}>
                            <Text>{request.sender.username}</Text>
                            <Button title="Accept" onPress={() => acceptRequest(request.id)} />
                            <Button title="Reject" onPress={() => rejectRequest(request.id)} />
                        </View>
                    ))
                ) : (
                    <Text>No pending connection requests</Text>
                )}
            </View>

            <Text style={[styles.title, { paddingTop: 15, paddingBottom: 5 }]}>Public Settings:</Text>
            <View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inlineLabel}>Enable Public Profile?</Text>
                    <Switch
                        value={showPublic}
                        trackColor={{ true: 'green', false: 'gray' }}
                        onValueChange={togglePublic}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inlineLabel}>Accept Connection Requests?</Text>
                    <Switch
                        value={enableConnections}
                        trackColor={{ true: 'green', false: 'gray' }}
                        onValueChange={setEnableConnections}
                    />
                </View>
            </View>

            

            <Text style={[styles.title, { paddingVertical: 5 }]}>Advertising:</Text>
            <View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.inlineLabel}>Show Adverts</Text>
                    <Switch
                        value={showAdverts}
                        trackColor={{ true: 'green', false: 'gray' }}
                        onValueChange={toggleAdverts}
                    />
                </View>        
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    inlineLabel: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    requestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
});

export default MySettings;
