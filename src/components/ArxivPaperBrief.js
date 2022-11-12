import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';


import Arxiv from '../util/Arxiv';


export default function ArxivPaperBrief(props) {
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={[styles.paperContainer, { backgroundColor: props.index % 2 === 0 ? '#fff' : '#eee' }]}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ ...styles.paperTitle, flex: 1 }}>{props.item.title}</Text>
                    <View style={{ flex: 0, marginRight: 8 }}>
                        {props.isFavourite ? <Ionicons
                            color='#000'
                            size={16}
                            name={'star'}
                        /> : null}
                    </View>
                </View>
                <Text style={{}}>ArXiv:{Arxiv.baseId(props.item.id)} [{props.item.category}]</Text>
                <Text>{props.item.authors.join(', ')}</Text>
                {props.item.comment ? <Text style={styles.paperComment}>Comments: {props.item.comment}</Text> : null}
                <Text style={styles.paperSummary} numberOfLines={8}>{props.item.summary}</Text>
            </View>
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    paperContainer: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
    },

    paperTitle: {
        paddingBottom: 4,
        fontSize: 16,
        fontWeight: '500',
    },

    paperSummary: {
        paddingTop: 8,
    },

    paperComment: {
    },
});
