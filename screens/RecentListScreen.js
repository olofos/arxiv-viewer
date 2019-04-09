import React from 'react';
import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';

import ArxivPaperBrief from '../components/ArxivPaperBrief';
import Arxiv from '../util/Arxiv';

import { groupBy } from '../util/Util';

function extractIDs(list) {
    if (list) {
        return list.map(item => item.id);
    } else {
        return [];
    }
}

export default class RecentListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('category', 'Unkown'),
        };
    };

    constructor(props) {
        super(props);
        this.state = { sections: [], numLoaded: 0, loaded: false };
    }

    insertEmptyPlaceHolder(list) {
        return (list.length > 0) ? list : [{}];
    }

    fetchMorePapers() {
        Arxiv.fetchRecent(this.props.navigation.getParam('category'), this.state.numLoaded, 25)
            .then(result => {
                const papers = groupBy(result, p => p.updated.toISOString().slice(0, 10));
                const newSections = Object.keys(papers).map(k => { return { title: k, data: papers[k] }; });

                let sections = this.state.sections;

                newSections.forEach(entry => {
                    const index = sections.findIndex(oldEntry => oldEntry.title === entry.title);
                    if (index >= 0) {
                        sections[index].data = sections[index].data.concat(entry.data);
                    } else {
                        sections = sections.concat(entry);
                    }
                });

                const numLoaded = this.state.numLoaded + result.length;

                this.setState({ sections: sections, loaded: true, numLoaded });
            });
    }

    componentDidMount() {
        this.fetchMorePapers();
    }

    render() {
        const { navigation } = this.props;
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <SectionList
                        sections={this.state.sections}

                        renderItem={({ item, index }) => {
                            if (item.id) {
                                return (
                                    <ArxivPaperBrief item={item} index={index} onPress={() => this.props.navigation.navigate('Paper', item)} />
                                );
                            } else {
                                return <View style={styles.paperContainer}><Text style={{ fontStyle: 'italic' }}>No new papers</Text></View>;
                            }
                        }}

                        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                        keyExtractor={(item, index) => index}

                        onEndReached={() => this.fetchMorePapers()}

                        ListFooterComponent={<ActivityIndicator />}
                    />
                </View>
            );
        } else {
            return (
                <View style={[styles.container, { flexDirection: 'row', justifyContent: 'space-around', }]}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: "#ccc",
    },
});
