import React from 'react';
import { View } from 'react-native';

const Section = ({ props }:any) => {
    return(
        <View style={{ height: props ? props.space : 10 }}></View>
    )
}

export { Section }; 