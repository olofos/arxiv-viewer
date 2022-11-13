import React from 'react';
import { SectionList, StyleSheet, Text, View, RefreshControl } from 'react-native';

import ArxivPaperBrief from './ArxivPaperBrief';
import { useFavourites } from '../util/Settings';
import Arxiv from '../util/Arxiv';
import Colors from '../constants/Colors';

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
                    <View style={styles.paperContainer}>
                        <Text style={{ fontStyle: 'italic' }}>No new papers</Text>
                    </View>
                );
            }}
            renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
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
                    colors={[Colors.tintColor]}
                    refreshing={props.refreshing}
                    onRefresh={() => props.onRefresh()}
                />
            }
        />
    );
}

const styles = StyleSheet.create({
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
});
