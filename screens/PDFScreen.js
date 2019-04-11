import React from 'react';
import {
    WebView,
} from 'react-native';

export default class PDFScreen extends React.Component {
    static navigationOptions = ({ navigation }) => (
        {
            title: `${navigation.getParam('id', '????.?????')} [${navigation.getParam('category')}]`,
        }
    )

    render() {
        console.log(`https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${this.props.navigation.getParam('id')}.pdf`);
        return (
            <WebView
                source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=https://arxiv.org/pdf/${this.props.navigation.getParam('id')}.pdf` }}
                style={{}}
            />
        );
    }
}
