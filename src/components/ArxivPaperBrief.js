import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';

import { Ionicons } from '@expo/vector-icons';

import Arxiv from '../util/Arxiv';

export default function ArxivPaperBrief({ ...props }) {
    const bg =
        props.index % 2 === 1 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-0 dark:bg-gray-600';

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View className={`${bg} p-2`}>
                <View className="flex-row pb-2">
                    <Text className="flex-1 text-base font-semibold leading-5 dark:text-gray-100">
                        {props.item.title}
                    </Text>
                    <View className="flex-0 pr-1 pt-0.5">
                        {props.isFavourite ? (
                            <Ionicons color={colors.black} size={16} name="star" />
                        ) : null}
                    </View>
                </View>
                <Text className="text-sm dark:text-gray-100">
                    ArXiv:{Arxiv.baseId(props.item.id)} [{props.item.category}]
                </Text>
                <Text className="text-sm dark:text-gray-100">{props.item.authors.join(', ')}</Text>
                {props.item.comment ? (
                    <Text className="text-sm dark:text-gray-100">
                        Comments: {props.item.comment}
                    </Text>
                ) : null}
                <Text className="text-sm pt-2 text-justify dark:text-gray-100" numberOfLines={8}>
                    {props.item.summary}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
