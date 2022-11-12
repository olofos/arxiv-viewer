import React from 'react';
import {
    FlatList,
    RefreshControl,
} from 'react-native';

import ArxivPaperBrief from './ArxivPaperBrief';

import Colors from '../constants/Colors';

export default function ArxivPaperFlatList(props) {
    return (
        <FlatList
            data={props.data}

            renderItem={({ item, index }) => (
                <ArxivPaperBrief item={item} index={index} onPress={() => props.navigation.navigate('PaperScreen', { item })} />
            )}

            keyExtractor={item => item.id}

            refreshControl={
                <RefreshControl
                    colors={[Colors.tintColor]}
                    refreshing={props.refreshing}
                    onRefresh={() => props.onRefresh && props.onRefresh()}
                />
            }

            onEndReachedThreshold={1}
            onEndReached={() => {
                if (props.onEndReached) {
                    props.onEndReached();
                }
            }}
        />
    );
}
