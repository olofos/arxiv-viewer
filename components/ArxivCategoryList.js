import React from 'react';

import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Arxiv from '../util/Arxiv';


class ArxivCategoryItem extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.onPress(this.props.item)}>
                <View style={{ backgroundColor: this.props.index % 2 === 1 ? '#eee' : '#fff', paddingLeft: (this.props.item.category.indexOf('.') > 0) ? 8 : 0 }} >
                    <View><Text style={styles.itemCategory}>{this.props.item.category}</Text></View>
                    <View><Text style={styles.itemName}>{this.props.item.name}</Text></View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default class ArxivCategoryList extends React.Component {
    constructor(props) {
        super(props);

        const sections = Arxiv.categories;

        this.state = { sections };
    }

    render() {
        return (
            <SectionList
                sections={this.state.sections}
                renderItem={({ item, index }) => (
                    <ArxivCategoryItem item={item} index={index} onPress={() => this.props.onPress(item)} />
                )}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={(item, index) => index}
                stickySectionHeadersEnabled={true}
            />
        );
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingTop: 4,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#ccc',
    },
    itemCategory: {
        paddingTop: 2,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemName: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 2,
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
    },
});
