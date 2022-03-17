import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default class PDFScreen extends React.Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: `${navigation.getParam('id', '????.?????')} [${navigation.getParam('category')}]`,
        }
    );

    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${this.props.navigation.getParam('id')}.pdf` }}
                    style={{}}
                    startInLoadingState={true}
                    renderLoading={() => <ActivityIndicator
                        style={{ flex: 1 }}
                        size='large'
                        color='#ff0000'
                    />}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                    }}
                />
            </View>
        );
    }
}
