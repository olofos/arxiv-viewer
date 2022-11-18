import React, { useEffect, useRef } from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { Ionicons } from '@expo/vector-icons';

import Arxiv from '../util/Arxiv';

const sectionHeaderHeight = 32;
const itemHeight = 48;

function ArxivCategoryItem({ item, mark, ...props }) {
    const bg = props.index % 2 === 1 ? 'bg-gray-200' : 'bg-gray-0';
    const pl = item.topLevel ? 'pl-4' : 'pl-2';

    return (
        <TouchableOpacity onPress={() => props.onPress(item)}>
            <View className={`${pl} ${bg} flex-1 flex-row`} style={{ height: itemHeight }}>
                <View className="flex-column flex-1 justify-center">
                    <Text className="font-semibold">{item.category}</Text>
                    <Text className="font-base">{item.name}</Text>
                </View>
                <View className="flex-column justify-center pr-3">
                    {mark && <Ionicons name="checkmark" size={18} />}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function ArxivCategoryList({ defaultCategory, ...props }) {
    const sections = Arxiv.categories;

    const sectionListRef = useRef(null);

    useEffect(() => {
        let index = { sectionIndex: 0, itemIndex: 0 };
        const sectionIndex = sections.findIndex(
            (sect) => sect.data.findIndex((cat) => cat.category === defaultCategory) >= 0
        );
        if (sectionIndex >= 0) {
            const itemIndex = sections[sectionIndex].data.findIndex(
                (cat) => cat.category === defaultCategory
            );
            index = { sectionIndex, itemIndex };
        }

        sectionListRef.current.scrollToLocation({ ...index, animated: false });
    }, [defaultCategory, sections]);

    const getItemLayout = sectionListGetItemLayout({
        getItemHeight: () => itemHeight,
        getSeparatorHeight: () => 0,
        getSectionHeaderHeight: () => sectionHeaderHeight,
        getSectionFooterHeight: () => 0,
        listHeaderHeight: 0,
    });

    return (
        <SectionList
            sections={sections}
            renderItem={({ item, index }) => (
                <ArxivCategoryItem
                    item={item}
                    index={index}
                    mark={props?.mark && item.category === defaultCategory}
                    onPress={() => props.onPress(item)}
                />
            )}
            renderSectionHeader={({ section }) => (
                <View
                    className="pl-2 bg-gray-400 flex-column justify-around"
                    style={{ height: sectionHeaderHeight }}
                >
                    <Text className="font-semibold text-base">{section.title}</Text>
                </View>
            )}
            keyExtractor={(item, index) => index}
            stickySectionHeadersEnabled={false}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={() => {}}
            ref={sectionListRef}
        />
    );
}
