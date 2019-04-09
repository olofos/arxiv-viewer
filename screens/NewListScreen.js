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

const CustomHeader = ({ title, subtitle }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
);

export default class NewListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <CustomHeader title={navigation.getParam('category', 'Unkown')} subtitle={navigation.getParam('activeSection', 'Loading')} />,
    });

    constructor(props) {
        super(props);
        this.state = { newPapers: [], updatedPapers: [], crossListedPapers: [], loaded: false };
        this._isMounted = false;
    }


    insertEmptyPlaceHolder(list) {
        return (list.length > 0) ? list : [{}];
    }

    componentDidMount() {
        this._isMounted = true;
        Arxiv.fetchNew(this.props.navigation.getParam('category'))
            .then((result) => {
                const papers = groupBy(result, 'section');

                const promiseNew = Arxiv.fetchPapersById(extractIDs(papers.new))
                    .then(result => this.insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this._isMounted) {
                            this.setState({ newPapers: result });
                        }
                    });

                const promiseUpdated = Arxiv.fetchPapersById(extractIDs(papers.updated))
                    .then(result => this.insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this._isMounted) {
                            this.setState({ updatedPapers: result });
                        }
                    });

                const promiseCrossListed = Arxiv.fetchPapersById(extractIDs(papers.crossListed))
                    .then(result => this.insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this._isMounted) {
                            this.setState({ crossListedPapers: result });
                        }
                    });

                Promise.all([promiseNew, promiseUpdated, promiseCrossListed]).then(() => {
                    if (this._isMounted) {
                        this.setState({ loaded: true });
                    }
                });
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { navigation } = this.props;
        if (this.state.loaded) {
            return (
                <View style={styles.container}>
                    <SectionList
                        sections={[{ title: 'New', data: this.state.newPapers }, { title: 'Cross Listed', data: this.state.crossListedPapers }, { title: 'Updated', data: this.state.updatedPapers }]}

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
                        onViewableItemsChanged={(data) => this.onCheckViewableItems(data)}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50,
                            waitForInteraction: false,
                        }}
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

    onCheckViewableItems = ({ viewableItems, changed }) => {
        if (viewableItems.length > 0) {
            const section = viewableItems[0].section.title.toLowerCase();
            let number = viewableItems[0].section.data.length;

            if (number === 1 && viewableItems[0].section.data[0].id === undefined) {
                number = 0;
            }

            const { setParams } = this.props.navigation;

            setParams({
                activeSection: `Showing ${number} ${section} ${number === 1 ? 'paper' : 'papers'}`
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },

    headerSubtitle: {
        fontSize: 12,
        color: '#fff',
    },

    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
        backgroundColor: "#ccc",
    },
});
