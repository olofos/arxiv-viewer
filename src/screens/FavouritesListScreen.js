import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Arxiv from '../util/Arxiv';
import Settings, { useFavourites } from '../util/Settings';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';


export default function FavouritesListScreen(props) {
    const [favourites, setFavourites] = useState([]);
    const [fetching, setFetching] = useState(false);

    const favouriteIds = useFavourites();

    useEffect(() => {
        setFetching(true);
        if (favouriteIds.length > 0) {
            Arxiv.fetchPapersById(favouriteIds)
                .then(papers => {
                    setFavourites(papers);
                    setFetching(false);
                });
        } else {
            setFavourites([]);
            setFetching(false);
        }
    }, [favouriteIds]);

    if (favourites.length > 0 || fetching) {
        return (
            <View style={styles.container}>
                <ArxivPaperFlatList
                    data={favourites}
                    refreshing={fetching}
                    navigation={props.navigation}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={{ fontStyle: 'italic', padding: 8 }}>No favourites added</Text>
                <Text style={{ fontStyle: 'italic', paddingLeft: 8, paddingRight: 8 }}>Add a paper as a favourite by tapping the star icon</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
