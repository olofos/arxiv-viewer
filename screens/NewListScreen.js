import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ArxivPaperSectionList from '../components/ArxivPaperSectionList';
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

function insertEmptyPlaceHolder(list) {
    return (list.length > 0) ? list : [{}];
}

export default class NewListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: () => <CustomHeader title={navigation.getParam('category', 'Unknown')} subtitle={navigation.getParam('activeSection', 'Loading')} />,
    });

    constructor(props) {
        super(props);
        this.state = { newPapers: [], updatedPapers: [], crossListedPapers: [], fetching: false };
        this.screenIsMounted = false;
    }

    fetchPapers() {
        this.setState({ fetching: true });
        this.props.navigation.setParams({ activeSection: 'Loading' });

        Arxiv.fetchNew(this.props.navigation.getParam('category'))
            .then((resultPapers) => {
                const papers = groupBy(resultPapers, 'section');

                const promiseNew = Arxiv.fetchPapersById(extractIDs(papers.new))
                    .then(result => insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this.screenIsMounted) {
                            this.setState({ newPapers: result });
                        }
                    });

                const promiseUpdated = Arxiv.fetchPapersById(extractIDs(papers.updated))
                    .then(result => insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this.screenIsMounted) {
                            this.setState({ updatedPapers: result });
                        }
                    });

                const promiseCrossListed = Arxiv.fetchPapersById(extractIDs(papers.crossListed))
                    .then(result => insertEmptyPlaceHolder(result))
                    .then((result) => {
                        if (this.screenIsMounted) {
                            this.setState({ crossListedPapers: result });
                        }
                    });

                Promise.all([promiseNew, promiseUpdated, promiseCrossListed]).then(() => {
                    if (this.screenIsMounted) {
                        this.setState({ fetching: false });
                    }
                });
            });
    }

    componentDidMount() {
        this.screenIsMounted = true;
        this.fetchPapers();
    }

    componentWillUnmount() {
        this.screenIsMounted = false;
    }

    render() {
        return (
            <View style={styles.container}>
                <ArxivPaperSectionList
                    sections={this.state.fetching ? [] : [
                        { title: 'New', data: this.state.newPapers },
                        { title: 'Cross Listed', data: this.state.crossListedPapers },
                        { title: 'Updated', data: this.state.updatedPapers },
                    ]}
                    refreshing={this.state.fetching}
                    navigation={this.props.navigation}
                    onRefresh={() => this.fetchPapers()}
                    onViewableItemsChanged={data => this.onViewableItemsChanged(data)}
                />
            </View>
        );
    }

    onViewableItemsChanged({ viewableItems }) {
        if (viewableItems.length > 0) {
            const section = viewableItems[0].section.title.toLowerCase();
            let number = viewableItems[0].section.data.length;

            if (number === 1 && viewableItems[0].section.data[0].id === undefined) {
                number = 0;
            }

            const { setParams } = this.props.navigation;

            setParams({
                activeSection: `Showing ${number} ${section} ${number === 1 ? 'paper' : 'papers'}`,
            });
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
});
