import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import colors from 'tailwindcss/colors';

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
        <WebView
            source={{
                uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${item.id}.pdf`,
            }}
            className="flex-1"
            startInLoadingState
            renderLoading={() => (
                <ActivityIndicator className="flex-1" size="large" color={colors.gray[500]} />
            )}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
            }}
        />
    );
}
