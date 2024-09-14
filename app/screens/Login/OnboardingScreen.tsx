import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import Onboarding from 'react-native-onboarding-swiper';
import { completeOnboarding } from '../../actions/onboardingActions';
import OnboardingCityPills from '../../components/OnboardingCityPills'; 

const OnboardingScreen = ({ navigation }:any ) => {
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    // Log the navigation prop to verify it exists
    useEffect(() => {
        console.log('Navigation prop:', navigation);
    }, [navigation]);

    const handleCityChange = (city: string) => {
        setSelectedCities((prevCities) => {
            if (prevCities.includes(city)) {
                return prevCities.filter((item) => item !== city);
            } else {
                return [...prevCities, city];
            }
        });
    };

    const handleOnDone = async () => {
        if (user?.id) {
            // @ts-ignore
            const updatedUser = await dispatch(completeOnboarding(user.id, selectedCities));
    
            if (updatedUser) {
                console.log('Navigating to Account with user:', updatedUser);
                navigation.navigate('Login'); // This assumes Account is in the main stack
            } else {
                console.error('Onboarding failed. User update was unsuccessful.');
            }
        } else {
            console.error('User ID is not set. Cannot complete onboarding.');
        }
    };

    useEffect(() => {
        if (user) {
            setSelectedCities([]); // Optional: Reset selected cities if needed
        }
    }, [user]);

    return (
        <Onboarding
            onSkip={handleOnDone}
            onDone={handleOnDone}
            pages={[
                {
                    backgroundColor: '#000',
                    image: <Text>🎉</Text>,
                    title: 'Onboarding Step 1',
                    subtitle: 'Description of Step 1',
                },
                {
                    backgroundColor: '#fe6e58',
                    image: <Text>🚀</Text>,
                    title: 'Onboarding Step 2',
                    subtitle: 'Description of Step 2',
                },
                {
                    backgroundColor: '#999',
                    image: <Text>✨{user ? user.id : 'WELCOME!'}</Text>,
                    title: (
                        <View style={{ alignItems: 'center' }}>
                            <Text>Select Your City</Text>
                        </View>
                    ),
                    subtitle: (
                        <OnboardingCityPills
                            user={user}
                            selectedCities={selectedCities}
                            handleCityChange={handleCityChange}
                      />
                    ),
                },
            ]}
        />
    );
};

export default OnboardingScreen;
