import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import ArxivPaperSectionList from '../components/ArxivPaperSectionList';
import Arxiv from '../util/Arxiv';

import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

import { groupBy } from '../util/Util';

function extractIDs(list) {
    if (list) {
        return list.map((item) => item.id);
    }
    return [];
}

function insertEmptyPlaceHolder(list) {
    return list.length > 0 ? list : [{}];
}

export default function NewListScreen({ navigation, route }) {
    const { category } = route.params;
    const [newPapers, setNewPapers] = useState([]);
    const [updatedPapers, setUpdatedPapers] = useState([]);
    const [crossListedPapers, setCrossListedPapers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [subtitle, setSubtitle] = useState('');

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleSubtitleHeader title={category} subtitle={subtitle} />,
        });
    }, [category, navigation, subtitle]);

    const fetchPapers = useCallback(() => {
        setFetching(true);
        setSubtitle('Loading');

        Arxiv.fetchNew(category).then((resultPapers) => {
            const papers = groupBy(resultPapers, 'section');

            const promiseNew = Arxiv.fetchPapersById(extractIDs(papers.new))
                .then((result) => insertEmptyPlaceHolder(result))
                .then((result) => {
                    setNewPapers(result);
                });

            const promiseUpdated = Arxiv.fetchPapersById(extractIDs(papers.updated))
                .then((result) => insertEmptyPlaceHolder(result))
                .then((result) => {
                    setUpdatedPapers(result);
                });

            const promiseCrossListed = Arxiv.fetchPapersById(extractIDs(papers.crossListed))
                .then((result) => insertEmptyPlaceHolder(result))
                .then((result) => {
                    setCrossListedPapers(result);
                });

            Promise.all([promiseNew, promiseUpdated, promiseCrossListed]).then(() => {
                setFetching(false);
            });
        });
    }, [category]);

    useEffect(() => {
        fetchPapers();
    }, [fetchPapers]);

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const section = viewableItems[0].section.title.toLowerCase();
            let number = viewableItems[0].section.data.length;

            if (number === 1 && viewableItems[0].section.data[0].id === undefined) {
                number = 0;
            }

            setSubtitle(`Showing ${number} ${section} ${number === 1 ? 'paper' : 'papers'}`);
        }
    };

    return (
        <View style={styles.container}>
            <ArxivPaperSectionList
                sections={
                    fetching
                        ? []
                        : [
                              { title: 'New', data: newPapers },
                              { title: 'Cross Listed', data: crossListedPapers },
                              { title: 'Updated', data: updatedPapers },
                          ]
                }
                refreshing={fetching}
                navigation={navigation}
                onRefresh={() => fetchPapers()}
                onViewableItemsChanged={(data) => onViewableItemsChanged(data)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },

    headerSubtitle: {
        fontSize: 12,
        color: '#000',
    },
});
