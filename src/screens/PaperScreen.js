import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import MathJax from '../components/MathJax';
import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

import Settings, { useFavourites } from '../util/Settings';
import Arxiv from '../util/Arxiv';

function PaperSummary({ useMathJax, summary }) {
    if (!useMathJax) {
        return (
            <View style={styles.box}>
                <Text style={styles.paperSummary}>{summary}</Text>
            </View>
        );
    }
    return (
        <View style={[styles.box, { paddingLeft: 4, flex: 1 }]}>
            <MathJax
                // HTML content with MathJax support
                html={`<p style="font-size:12pt;padding:0px;margin:0px">${summary}</p>`}
                // MathJax config option
                mathJaxOptions={{
                    messageStyle: 'none',
                    extensions: ['tex2jax.js'],
                    jax: ['input/TeX', 'output/HTML-CSS'],
                    tex2jax: {
                        inlineMath: [
                            ['$', '$'],
                            ['\\(', '\\)'],
                        ],
                        displayMath: [
                            ['$$', '$$'],
                            ['\\[', '\\]'],
                        ],
                        processEscapes: true,
                    },
                    TeX: {
                        extensions: [
                            'AMSmath.js',
                            'AMSsymbols.js',
                            'noErrors.js',
                            'noUndefined.js',
                        ],
                    },
                }}
                style={{ paddingLeft: 0, margin: 0, flex: 1 }}
            />
        </View>
    );
}

function HeaderButtons({ id, isFavourite, navigation, item }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    Settings.toggleFavourite(id);
                }}
            >
                <View style={{ flex: 0, marginRight: 14 }}>
                    <Ionicons color="#fff" size={24} name={isFavourite ? 'star' : 'star-outline'} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    Settings.getConfig('openPDFInBrowser').then((browser) => {
                        if (browser) {
                            Linking.openURL(`https://arxiv.org/pdf/${item.id}`);
                        } else {
                            navigation.navigate('PDFScreen', item);
                        }
                    });
                }}
            >
                <Text style={{ marginRight: 14, color: '#fff' }}>PDF</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function PaperScreen({ navigation, route }) {
    const [useMathJax, setUseMathJax] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const { item } = route.params;
    const id = Arxiv.baseId(item.id);
    const favourites = useFavourites();
    const isFavourite = !!favourites.find((elem) => elem === id);

    useEffect(() => {
        const promiseMJ = Settings.getConfig('useMathJax').then((newUseMathJax) => {
            setUseMathJax(newUseMathJax);
        });

        Promise.all([promiseMJ]).then(() => setLoaded(true));
    }, []);

    useEffect(() => {
        const updateUseMathJax = (config) => setUseMathJax(config.useMathJax);
        const subscription = Settings.addEventListener('config-updated', updateUseMathJax);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleSubtitleHeader title={id} subtitle={item.category} />,
        });
    }, [item, id, navigation]);

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
                <HeaderButtons
                    id={id}
                    item={item}
                    navigation={navigation}
                    isFavourite={isFavourite}
                />
            ),
        });
    }, [isFavourite, item, navigation, id]);

    if (!loaded) {
        return null;
    }

    return (
        // The app crashes if the webview is rendered off screen. removeClippedSubviews={true} prevents this
        <ScrollView style={styles.paperContainer} removeClippedSubviews>
            <Text style={[styles.box, styles.paperTitle]}>{item.title}</Text>
            <View style={[styles.box, { flex: 1 }]}>
                {item.authors.map((name) => (
                    <Text key={name} style={styles.paperAuthor}>
                        {name}
                    </Text>
                ))}
            </View>

            <PaperSummary useMathJax={useMathJax} summary={item.summary} />
            {item.comment ? (
                <Text style={[styles.box, styles.paperComment]}>Comments: {item.comment}</Text>
            ) : null}

            <TouchableOpacity
                onPress={() => {
                    Linking.openURL(`https://arxiv.org/abs/${item.id}`);
                }}
            >
                <View style={[styles.box, { flexDirection: 'row', justifyContent: 'center' }]}>
                    <Text style={{ flex: 1, alignSelf: 'center' }}>Open arxiv page in browser</Text>

                    <View
                        style={{
                            flex: 0,
                            marginRight: 15,
                            alignSelf: 'center',
                        }}
                    >
                        <Ionicons name="chevron-forward" color="#aaa" size={16} />
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
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

    paperAuthor: {
        fontSize: 16,
    },

    paperTitle: {
        padding: 4,
        fontSize: 16,
        fontWeight: '500',
    },

    paperSummary: {
        fontSize: 16,
    },

    paperComment: {},

    item: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 12,
    },
});
