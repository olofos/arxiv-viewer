import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Arxiv from '../util/Arxiv';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';

export default class SearchListScreen extends React.Component {
    static navigationOptions = {
        title: 'Search Result',
    };

    constructor(props) {
        super(props);
        this.state = { papers: [], numLoaded: 0, fetching: true };

        this.query = this.props.navigation.state.params.query;
        this.numLoaded = 0;
    }

    fetchMorePapers() {
        this.setState({ fetching: true });
        Arxiv.fetchPapersBySearchQuery(this.query, this.state.numLoaded, 25)
            .then((newPapers) => {
                if (this.state.numLoaded === 0 && newPapers.length === 1) {
                    this.props.navigation.replace('Paper', { item: newPapers[0] });
                } else {
                    this.setState({ papers: [...this.state.papers, ...newPapers], numLoaded: this.state.numLoaded + newPapers.length, fetching: false });
                }
            });
    }

    componentDidMount() {
        this.fetchMorePapers();
    }

    render() {
        if (this.state.papers.length > 0 || this.state.fetching) {
            return (
                <View style={styles.container}>
                    <ArxivPaperFlatList
                        data={this.state.papers}
                        refreshing={this.state.fetching}
                        navigation={this.props.navigation}
                        onEndReached={() => this.fetchMorePapers()}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Text style={{ fontStyle: 'italic', padding: 8 }}>No papers found</Text>
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
});
