import React from 'react';
import { View, Text } from 'react-native';

import { expo } from '../../app.json';

export default function AboutScreen() {
    return (
        <View className="flex-1 bg-gray-200">
            <View className="flex-1 m-6">
                <View>
                    <Text>ArXiv Viewer</Text>
                    <Text>Version {expo.version}</Text>
                    <Text>{'\u00A9'} 2019-2022 Olof Ohlsson Sax</Text>
                </View>
                <View className="flex-1" />
                <View>
                    <Text>Acknowledgements:</Text>
                </View>
            </View>
        </View>
    );
}
