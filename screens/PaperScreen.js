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
} from 'react-native';
import { WebBrowser } from 'expo';

import MathJax from 'react-native-mathjax';

export default class PaperScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.getParam('id', '????.?????')} [${navigation.getParam('category')}]`,
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('PDF', navigation.state.params)}>
                    <Text style={{ marginRight: 14, color: "#fff" }}>PDF</Text>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.navigation.state.params;
        const { navigation } = this.props;
        return (
            <ScrollView style={styles.paperContainer}>
                <Text style={[styles.box, styles.paperTitle]}>{item.title}</Text>
                <FlatList
                    style={[styles.box, { flex: 1 }]}
                    data={item.authors}
                    renderItem={(it) => <Text>{it.item}</Text>}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={[styles.box, { paddingLeft: 4 }]}>
                    <MathJax
                        // HTML content with MathJax support
                        html={(`<p style="font-size:12pt;padding:0px;margin:0px">${item.summary}</p>`)}
                        // MathJax config option
                        mathJaxOptions={{
                            messageStyle: 'none',
                            extensions: ['tex2jax.js'],
                            jax: ['input/TeX', 'output/HTML-CSS'],
                            tex2jax: {
                                inlineMath: [['$', '$'], ['\\(', '\\)']],
                                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                                processEscapes: true,
                            },
                            TeX: {
                                extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
                            }
                        }}
                        style={{ paddingLeft: 0, margin: 0 }}
                    />
                </View>
                {item.comment ? <Text style={[styles.box, styles.paperComment]}>Comment: {item.comment}</Text> : null}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: 12,
    },

    paperContainer: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 8,
        backgroundColor: '#eee',
    },

    paperTitle: {
        padding: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },

    paperSummary: {
    },

    paperComment: {
    },

    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: "#ccc",
    },
    item: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 12,
    },
});
