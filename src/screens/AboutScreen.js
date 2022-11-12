import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import { expo } from '../../app.json';

export default function AboutScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#eee' }}>
            <View style={{ margin: 24 }}>
                <Text>ArXiv Viewer</Text>
                <Text>Version {expo.version}</Text>
                <Text>{'\u00A9'} 2019-2022 Olof Ohlsson Sax</Text>
            </View>
        </View>
    );
}
