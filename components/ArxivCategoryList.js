import React from 'react';

import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import Arxiv from '../util/Arxiv';

class ArxivCategoryItem extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.onPress(this.props.item)}>
                <View style={[styles.itemRow, { backgroundColor: this.props.index % 2 === 1 ? '#eee' : '#fff', paddingLeft: (this.props.item.category.indexOf('.') > 0) ? 8 : 0 }]} >
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

        this.getItemLayout = sectionListGetItemLayout({
            getItemHeight: () => styles.itemRow.height,
            getSeparatorHeight: () => 0,
            getSectionHeaderHeight: () => styles.sectionHeader.height,
            getSectionFooterHeight: () => 0,
            listHeaderHeight: 0,
        });
    }

    getSectionIndex(category) {
        const sectionIndex = this.state.sections.findIndex(sect => sect.data.findIndex(cat => cat.category === category) > 0);

        if (sectionIndex >= 0) {
            const itemIndex = this.state.sections[sectionIndex].data.findIndex(cat => cat.category === category);
            return { sectionIndex, itemIndex };
        }
        return { sectionIndex: -1, itemIndex: -1 };
    }

    scrollToCategory(category) {
        if (category) {
            const { sectionIndex, itemIndex } = this.getSectionIndex(category);

            if (itemIndex >= 0) {
                this.sectionList.scrollToLocation({ sectionIndex, itemIndex, animated: false });
            }
        }
        return category;
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
                stickySectionHeadersEnabled={false}

                getItemLayout={this.getItemLayout}
                ref={(sectionList) => { this.sectionList = sectionList; }}
            />
        );
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        height: 32,
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
    itemRow: {
        height: 48,
    },
    itemName: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 2,
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
    },
});
