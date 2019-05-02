import React from 'react';
import {
    FlatList,
    RefreshControl,
} from 'react-native';

import ArxivPaperBrief from './ArxivPaperBrief';

import Colors from '../constants/Colors';

export default class ArxivPaperFlatList extends React.Component {
    render() {
        return (
            <FlatList
                data={this.props.data}

                renderItem={({ item, index }) => (
                    <ArxivPaperBrief item={item} index={index} onPress={() => this.props.navigation.navigate('Paper', { item })} />
                )}

                keyExtractor={item => item.id}

                refreshControl={
                    <RefreshControl
                        colors={[Colors.tintColor]}
                        refreshing={this.props.refreshing}
                        onRefresh={() => this.props.onRefresh && this.props.onRefresh()}
                    />
                }

                onEndReachedThreshold={1}
                onEndReached={() => {
                    if (this.props.onEndReached) {
                        this.props.onEndReached();
                    }
                }}
            />
        );
    }
}
