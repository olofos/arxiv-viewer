import React from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    View,
    RefreshControl,
} from 'react-native';

import ArxivPaperBrief from './ArxivPaperBrief';

import Colors from '../constants/Colors';

export default class ArxivPaperSectionList extends React.Component {
    render() {
        return (
            <SectionList
                sections={this.props.sections}

                renderItem={({ item, index }) => {
                    if (item.id) {
                        return (
                            <ArxivPaperBrief item={item} index={index} onPress={() => this.props.navigation.navigate('Paper', { item })} />
                        );
                    } else {
                        return <View style={styles.paperContainer}><Text style={{ fontStyle: 'italic' }}>No new papers</Text></View>;
                    }
                }}

                renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}

                keyExtractor={(item, index) => index}

                onEndReachedThreshold={1}
                onEndReached={() => {
                    if (this.props.onEndReached) {
                        this.props.onEndReached();
                    }
                }}

                onViewableItemsChanged={(data) => {
                    if (this.props.onViewableItemsChanged) {
                        this.props.onViewableItemsChanged(data);
                    }
                }}

                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                    waitForInteraction: false,
                }}

                refreshControl={
                    <RefreshControl
                        colors={[Colors.tintColor]}
                        refreshing={this.props.refreshing}
                        onRefresh={() => this.props.onRefresh()}
                    />
                }
            />
        );
    }
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
