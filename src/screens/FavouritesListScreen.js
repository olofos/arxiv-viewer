import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import Arxiv from '../util/Arxiv';
import { useFavourites } from '../util/Settings';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';
import TitleHeader from '../components/TitleHeader';

export default function FavouritesListScreen({ navigation }) {
    const [favourites, setFavourites] = useState([]);
    const [fetching, setFetching] = useState(false);

    const favouriteIds = useFavourites();

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleHeader title="Favourites" />,
        });
    }, [navigation]);

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
            <ArxivPaperFlatList data={favourites} refreshing={fetching} navigation={navigation} />
        );
    }

    return (
        <View className="pl-2 pt-3">
            <Text className="italic">
                {'No favourites added\n\nAdd a paper as a favourite by tapping the star icon'}
            </Text>
        </View>
    );
}
