import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import colors from 'tailwindcss/colors';

import { Ionicons } from '@expo/vector-icons';

import MathJax from '../components/MathJax';
import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

import { useConfig, useIsFavouriteWithToggle } from '../util/Settings';
import Arxiv from '../util/Arxiv';

function PaperSummary({ useMathJax, summary }) {
    if (!useMathJax) {
        return (
            <View className="pl-2 pr-4 py-1 mb-3 bg-white flex-row justify-center">
                <Text className="text-base text-justify">{summary}</Text>
            </View>
        );
    }
    return (
        <View className="pl-2 pr-3 py-2 mb-3 bg-white flex-row justify-center">
            <MathJax
                // HTML content with MathJax support
                html={`<p style="
                font-size:12pt;
                padding:0px;
                margin:0px;
                text-align:justify;
                text-justify:inter-word
                ">${summary}</p>`}
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
            />
        </View>
    );
}

function HeaderButtons({ navigation, item, isFavourite, toggleFavourite }) {
    const browser = useConfig('openPDFInBrowser');
    return (
        <View className="flex-row items-center">
            <TouchableOpacity onPress={toggleFavourite}>
                <View className="flex-0 mr-3">
                    <Ionicons
                        color={colors.white}
                        size={24}
                        name={isFavourite ? 'star' : 'star-outline'}
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (browser) {
                        Linking.openURL(`https://arxiv.org/pdf/${item.id}.pdf`);
                    } else {
                        navigation.navigate('PDFScreen', item);
                    }
                }}
            >
                <Text className="flex-0 text-white pr-0 mr-0">PDF</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function PaperScreen({ navigation, route }) {
    const { item } = route.params;
    const id = Arxiv.baseId(item.id);
    const [isFavourite, toggleFavourite] = useIsFavouriteWithToggle(id);
    const useMathJax = useConfig('useMathJax');

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
                    item={item}
                    navigation={navigation}
                    isFavourite={isFavourite}
                    toggleFavourite={toggleFavourite}
                />
            ),
        });
    }, [item, navigation, isFavourite, toggleFavourite]);

    return (
        <ScrollView className="pt-3 flex-1 bg-gray-200" removeClippedSubviews>
            <Text className="pl-2 py-1 mb-3 bg-white font-semibold text-lg">{item.title}</Text>
            <View className="pl-2 py-1 mb-3 bg-white">
                {item.authors.map((name) => (
                    <Text key={name} className="text-base">
                        {name}
                    </Text>
                ))}
            </View>

            <PaperSummary useMathJax={useMathJax} summary={item.summary} />
            {item.comment ? (
                <Text className="pl-2 py-1 mb-3 bg-white font-base text-base">
                    Comments: {item.comment}
                </Text>
            ) : null}

            <TouchableOpacity
                onPress={() => {
                    Linking.openURL(`https://arxiv.org/abs/${item.id}`);
                }}
            >
                <View className="px-2 mb-6 py-1 bg-white flex-row justify-center">
                    <Text className="flex-1 self-center text-base">Open arxiv page in browser</Text>

                    <View className="flex-0 self-center pt-0.5 pl-1">
                        <Ionicons name="chevron-forward" color={colors.gray[400]} size={16} />
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
