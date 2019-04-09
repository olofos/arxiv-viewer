import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    SectionList,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    ActivityIndicator,
    WebView,
} from 'react-native';
import { WebBrowser } from 'expo';

export default class PDFScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.getParam('id', '????.?????')} [${navigation.getParam('category')}]`,
        };
    };

    constructor(props){
        super(props);
    }

    render() {
        console.log(`https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${this.props.navigation.getParam('id')}.pdf`);
        return (
            <WebView
              source={{uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${this.props.navigation.getParam('id')}.pdf`}}
            style={{}}
            />
        );
    }
}
