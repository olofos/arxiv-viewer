import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

export default class AboutScreen extends React.Component {
    static navigationOptions = {
        title: 'About',
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <View>
                <Text>ArXiv Viewer</Text>
                <Text>(c) 2019 Olof Ohlsson Sax</Text>
            </View>
        );
    }
}
