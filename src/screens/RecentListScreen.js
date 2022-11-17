import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import TitleSubtitleHeader from '../components/TitleSubtitleHeader';
import ArxivPaperSectionList from '../components/ArxivPaperSectionList';
import Arxiv from '../util/Arxiv';

import { groupBy } from '../util/Util';

export default function RecentListScreen({ navigation, route }) {
    const [sections, setSections] = useState([]);
    const [filteredSections, setFilteredSections] = useState([]);
    const [numLoaded, setNumLoaded] = useState(0);
    const [fetching, setFetching] = useState(true);
    const [subtitle, setSubtitle] = useState('Loading');
    const [showCrossref, setShowCrossref] = useState(true);

    const { category } = route.params;

    const fetchMorePapers = useCallback(
        (oldSections, oldNumLoaded) => {
            setFetching(true);

            Arxiv.fetchRecent(category, oldNumLoaded, 25).then((result) => {
                const papers = groupBy(result, (p) =>
                    new Date(p.updated).toISOString().slice(0, 10)
                );
                const newSections = Object.keys(papers).map((k) => ({ title: k, data: papers[k] }));

                let mergedSections = oldSections.map((entry) => ({
                    title: entry.title,
                    data: [...entry.data],
                }));

                newSections.forEach((entry) => {
                    const index = mergedSections.findIndex(
                        (oldEntry) => oldEntry.title === entry.title
                    );
                    if (index >= 0) {
                        mergedSections[index].data = mergedSections[index].data.concat(entry.data);
                    } else {
                        mergedSections = mergedSections.concat(entry);
                    }
                });

                setSections(mergedSections);
                setNumLoaded(oldNumLoaded + result.length);
                setFetching(false);
            });
        },
        [category]
    );

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setSubtitle(viewableItems[0].section.title);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleSubtitleHeader title={category} subtitle={subtitle} />,
        });
    }, [category, navigation, subtitle]);

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => {
                            setShowCrossref(!showCrossref);
                        }}
                    >
                        <View className="flex-0 mr-3">
                            <Text className="text-white text-xs text-center">
                                {`${showCrossref ? 'Hide' : 'Show'}\nCrossrefs`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, showCrossref]);

    useEffect(() => fetchMorePapers([], 0), [fetchMorePapers]);

    useEffect(() => {
        const filtered = sections.map((sect) => ({
            title: sect.title,
            data: sect.data.filter((entry) => showCrossref || entry.category === category),
        }));
        setFilteredSections(filtered);
    }, [category, sections, showCrossref]);

    return (
        <ArxivPaperSectionList
            sections={filteredSections}
            refreshing={fetching}
            navigation={navigation}
            onRefresh={() => {
                setSections([]);
                setNumLoaded(0);
                fetchMorePapers([], 0);
            }}
            onEndReached={() => fetchMorePapers(sections, numLoaded)}
            onViewableItemsChanged={(data) => onViewableItemsChanged(data)}
        />
    );
}
