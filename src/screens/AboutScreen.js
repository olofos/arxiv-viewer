import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import { expo } from '../../app.json';

import TitleHeader from '../components/TitleHeader';

export default function AboutScreen({ navigation }) {
    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleHeader title="About" />,
        });
    }, [navigation]);

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
