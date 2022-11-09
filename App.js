import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';

import MainTabNavigator from './navigation/MainTabNavigator';

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    if (!appIsReady) {
        return <AppLoading
            startAsync={async () => (
                Promise.all([
                    Asset.loadAsync([
                    ]),
                    Font.loadAsync({
                        ...Icon.Ionicons.font,
                    }),
                ]))}
            onError={(error) => {
                console.warn(error);
            }}
            onFinish={() => {
                setAppIsReady(true);
            }}
        />;
    } else {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <MainTabNavigator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
