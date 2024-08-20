import React from 'react';
import { View } from 'react-native';

const Spacer = ({ props }:any) => {
    return(
        <View style={{ height: props ? props.space : 10 }}></View>
    )
}

export default Spacer; 