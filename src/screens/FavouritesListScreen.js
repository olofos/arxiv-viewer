import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Arxiv from '../util/Arxiv';
import { useFavourites } from '../util/Settings';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';

export default function FavouritesListScreen({ ...props }) {
    const [favourites, setFavourites] = useState([]);
    const [fetching, setFetching] = useState(false);

    const favouriteIds = useFavourites();

    useEffect(() => {
        const currentIds = favourites.map((entry) => Arxiv.baseId(entry.id));
        const newIds = favouriteIds.filter((id) => !currentIds.find((elem) => elem === id));
        const extraIds = currentIds.filter((id) => !favouriteIds.find((entry) => entry === id));

        if (newIds.length === 0 && extraIds.length === 0) return;

        setFetching(true);
        const filteredFavourites = favourites.filter(
            (_, index) => !extraIds.find((id) => currentIds[index] === id)
        );
        Arxiv.fetchPapersById(newIds).then((newFavourites) => {
            setFavourites([...newFavourites, ...filteredFavourites]);
            setFetching(false);
        });
    }, [favouriteIds, favourites]);

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
    }

    return (
        <View style={styles.container}>
            <Text style={styles.defaultText}>No favourites added</Text>
            <Text style={styles.defaultText}>
                Add a paper as a favourite by tapping the star icon
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    defaultText: {
        fontStyle: 'italic',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
    },
});
