import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { setPublicProfile, setAdvertPreference } from '../../actions/settingsActions'; // Import the action


const MySettings = ({ navigation }: any) => {
    const [full_name, setFullname] = useState('');
    const [enableConnections, setEnableConnections] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state:any) => state.auth.user);
    const showAdverts = useSelector((state: any) => state.settings.showAdverts);
    const showPublic = useSelector((state: any) => state.settings.enablePublicProfile);


    const toggleAdverts = (value: boolean) => {
        // @ts-ignore
        dispatch(setAdvertPreference(value));
    };

    const togglePublic = (value: boolean) => {
        // @ts-ignore
        dispatch(setPublicProfile(value, user?.id))
    }; 


    useEffect(() => {
        navigation.setOptions({ headerTitle: 'My Settings' });
    }, [navigation]);

    return (
        <View style={styles.innerContainer}>
            <Text style={[styles.title, { paddingBottom: 5 }]}>Public Settings:</Text>
            <View>
                {/* Uncomment this if you want to use the Full Name input */}
                {/* <View style={styles.inputWrapper}>
                    <Text style={styles.inlineLabel}>Full Name:</Text>
                    <TextInput
                        placeholder={full_name}
                        placeholderTextColor='#000'
                        clearTextOnFocus={true}
                        value={full_name}
                        onChangeText={setFullname}
                        autoCapitalize={"none"}
                        style={styles.innerWrapperInputStyle}
                    />
                </View> */}
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
                        // style={styles.innerWrapperInputStyle}
                    />
                </View>        
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    label: {
        paddingTop: 10,
        fontWeight: 'bold',
    },
    formContainer: {
        flex: 3,
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align content to the top
        paddingRight: 16,
        paddingLeft: 16,
        marginTop: 10,
    },
    inputStyle: {
        marginTop: 10,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        color: '#000',
        padding: 10,
        borderRadius: 3,
    },
    selectedCity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 2,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 5,
        fontSize: 18,
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 0,
        width: '50%'
    },
    buttonText: {
        color: '#FFFFFF', // White text
        fontSize: 16,
        fontWeight: 'normal',
    },
    profileHeader: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 3,
        marginBottom: 5
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        justifyContent: 'space-between',
    },
    inlineLabel: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 10, // Space between label and input
    },
    innerWrapperInputStyle: {
        flex: 1,
        color: '#000',
        fontSize: 14,
    },
});

export default MySettings;
