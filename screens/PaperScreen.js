import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
} from 'react-native';

import { Icon } from 'react-native-elements';

import MathJax from '../components/MathJax';

import Settings from '../util/Settings';
import Arxiv from '../util/Arxiv';

class PaperSummary extends React.Component {
    render() {
        const { useMathJax, summary } = this.props;
        if (!useMathJax) {
            return (
                <View style={styles.box}>
                    <Text style={styles.paperSummary}>{summary}</Text>
                </View >
            );
        } else {
            return (
                <View style={[styles.box, { paddingLeft: 4, flex: 1 }]}>
                    <MathJax
                        // HTML content with MathJax support
                        html={(`<p style="font-size:12pt;padding:0px;margin:0px">${summary}</p>`)}
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
                                extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'],
                            },
                        }}
                        style={{ paddingLeft: 0, margin: 0, flex: 1 }}
                    />
                </View>
            );
        }
    }
}

const CustomHeader = ({ title, subtitle }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
);

export default class PaperScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { item } = navigation.state.params;
        return {
            headerTitle: () => CustomHeader({ title: item.id, subtitle: item.category }),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            const id = Arxiv.baseId(item.id);
                            Settings.toggleFavourite(id);
                        }}>
                        <Icon
                            containerStyle={{ flex: 0, marginRight: 8 }}
                            color='#fff'
                            size={24}
                            type='material'
                            name={navigation.state.params.isFavourite ? 'star' : 'star-border'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        Settings.getConfig('openPDFInBrowser').then((browser) => {
                            console.log(browser);
                            if (browser) {
                                Linking.openURL(`https://arxiv.org/pdf/${item.id}`);
                            } else {
                                navigation.navigate('PDF', item);
                            }
                        });
                    }}>
                        <Text style={{ marginRight: 14, color: '#fff' }}>PDF</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    constructor() {
        super();
        this.state = { loaded: false, useMathJax: false };
    }

    checkFavourite(favourites) {
        const { item } = this.props.navigation.state.params;
        const id = Arxiv.baseId(item.id);
        const isFavourite = !!favourites.find(elem => elem === id);
        this.props.navigation.setParams({ isFavourite });
        this.forceUpdate();
    }

    componentDidMount() {
        Settings.getConfig('useMathJax')
            .then((useMathJax) => {
                this.setState({ useMathJax, loaded: true });
            });

        Settings.getFavourites()
            .then(favourites => this.checkFavourite(favourites));

        this.favouriteListener = Settings.addEventListener('favourites-updated', favourites => this.checkFavourite(favourites));
    }

    componentWillUnmount() {
        if (this.favouriteListener) {
            this.favouriteListener.remove();
        }
    }

    render() {
        const { item } = this.props.navigation.state.params;
        if (!this.state.loaded) {
            return null;
        }
        return (
            <ScrollView style={styles.paperContainer}>
                <Text style={[styles.box, styles.paperTitle]}>{item.title}</Text>
                <View style={[styles.box, { flex: 1 }]}>
                    {item.authors.map((name, index) => <Text key={index}>{name}</Text>)}
                </View>

                <PaperSummary
                    useMathJax={this.state.useMathJax}
                    summary={item.summary}
                />
                {item.comment ? <Text style={[styles.box, styles.paperComment]}>Comments: {item.comment}</Text> : null}
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    box: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
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
        fontSize: 16,
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
        backgroundColor: '#ccc',
    },
    item: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 12,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },

    headerSubtitle: {
        fontSize: 12,
        color: '#fff',
    },
});
