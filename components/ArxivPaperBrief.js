import React from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    WebView,
} from 'react-native';


export default class ArxivPaperBrief extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.onPress()}>
              <View style={[styles.paperContainer,{backgroundColor: this.props.index % 2 == 0 ? "#fff" : "#eee"}]}>
                <Text style={styles.paperTitle}>{this.props.item.title}</Text>
                <Text>ArXiv:{this.props.item.id} [{this.props.item.category}]</Text>
                <Text>{this.props.item.authors.join(', ')}</Text>
                {this.props.item.comment ? <Text style={styles.paperComment}>Comment: {this.props.item.comment}</Text> : null}
                <Text style={styles.paperSummary} numberOfLines={8}>{this.props.item.summary}</Text>
              </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    paperContainer: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
    },

    paperTitle: {
        paddingBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },

    paperSummary: {
        paddingTop: 8,
    },

    paperComment: {
    },
});
