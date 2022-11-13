import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import Colors from '../constants/Colors';
import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

export default function PDFScreen({ navigation, route }) {
    const item = route.params;

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleSubtitleHeader title={item.id} subtitle={item.category} />,
        });
    });

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{
                    uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${item.id}.pdf`,
                }}
                style={{}}
                startInLoadingState
                renderLoading={() => (
                    <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.tintColor} />
                )}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
            />
        </View>
    );
}
