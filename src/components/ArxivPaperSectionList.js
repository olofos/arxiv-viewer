import React from 'react';
import { SectionList, Text, View, RefreshControl } from 'react-native';
import colors from 'tailwindcss/colors';

import ArxivPaperBrief from './ArxivPaperBrief';
import { useFavourites } from '../util/Settings';
import Arxiv from '../util/Arxiv';

export default function ArxivPaperSectionList({ ...props }) {
    const favourites = useFavourites();

    return (
        <SectionList
            sections={props.sections}
            renderItem={({ item, index }) => {
                if (item.id) {
                    const id = Arxiv.baseId(item.id);
                    return (
                        <ArxivPaperBrief
                            item={item}
                            index={index}
                            isFavourite={!!favourites.find((elem) => elem === id)}
                            onPress={() => {
                                props.navigation.navigate('PaperScreen', { item });
                            }}
                        />
                    );
                }
                return (
                    <View className="pl-2 pb-1">
                        <Text className="italic">No new papers</Text>
                    </View>
                );
            }}
            renderSectionHeader={({ section }) => (
                <Text className="pl-2 bg-gray-400 text-lg font-semibold">{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={1}
            onEndReached={() => {
                if (props.onEndReached) {
                    props.onEndReached();
                }
            }}
            onViewableItemsChanged={(data) => {
                if (props.onViewableItemsChanged) {
                    props.onViewableItemsChanged(data);
                }
            }}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
                waitForInteraction: false,
            }}
            refreshControl={
                <RefreshControl
                    colors={[colors.gray[500]]}
                    refreshing={props.refreshing}
                    onRefresh={() => props.onRefresh()}
                />
            }
        />
    );
}
