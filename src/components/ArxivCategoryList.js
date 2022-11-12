import React, { useEffect, useRef } from 'react';

import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import Arxiv from '../util/Arxiv';

function ArxivCategoryItem(props) {
    return (
        <TouchableOpacity onPress={() => props.onPress(props.item)}>
            <View style={[
                styles.itemRow,
                {
                    backgroundColor: props.index % 2 === 1 ? '#eee' : '#fff',
                    paddingLeft: (props.item.category.indexOf('.') > 0) ? 8 : 0
                }
            ]} >
                <View><Text style={styles.itemCategory}>{props.item.category}</Text></View>
                <View><Text style={styles.itemName}>{props.item.name}</Text></View>
            </View>
        </TouchableOpacity>
    );
}

export default function ArxivCategoryList({ defaultCategory, ...props }) {
    const sections = Arxiv.categories;

    const getSectionIndex = (category) => {
        const sectionIndex = sections.findIndex(sect => sect.data.findIndex(cat => cat.category === category) >= 0);
        if (sectionIndex >= 0) {
            const itemIndex = sections[sectionIndex].data.findIndex(cat => cat.category === category);
            return { sectionIndex, itemIndex };
        }
        return { sectionIndex: 0, itemIndex: 0 };
    }

    const sectionListRef = useRef(null);

    useEffect(() => {
        sectionListRef.current.scrollToLocation({ ...getSectionIndex(defaultCategory), animated: true });
    }, [defaultCategory]);

    const getItemLayout = sectionListGetItemLayout({
        getItemHeight: () => styles.itemRow.height,
        getSeparatorHeight: () => 0,
        getSectionHeaderHeight: () => styles.sectionHeader.height,
        getSectionFooterHeight: () => 0,
        listHeaderHeight: 0,
    });

    return (
        <SectionList
            sections={sections}
            renderItem={({ item, index }) => (
                <ArxivCategoryItem item={item} index={index} onPress={() => props.onPress(item)} />
            )}
            renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
            stickySectionHeadersEnabled={false}

            getItemLayout={getItemLayout}
            onScrollToIndexFailed={() => { }}
            ref={sectionListRef}
        />
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        height: 32,
        paddingTop: 4,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 4,
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: '#ccc',
    },
    itemCategory: {
        paddingTop: 2,
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: 16,
        fontWeight: '500',
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
