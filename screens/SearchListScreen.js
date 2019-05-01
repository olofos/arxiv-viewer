import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Arxiv from '../util/Arxiv';
import Settings from '../util/Settings';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';

export default class SearchListScreen extends React.Component {
    static navigationOptions = {
        title: 'Search Result',
    };

    constructor(props) {
        super(props);
        this.state = { papers: [], fetching: true };
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params);
        const { query } = this.props.navigation.state.params;

        if (query.ids) {
            const ids = query.ids.split(/[\s,]/).filter(s => s.length > 0).map(Arxiv.makeCanonicalId);

            Arxiv.fetchPapersById(ids)
                .then(papers => this.setState({ papers, fetching: false }));
        }
    }

    render() {
        if (this.state.papers.length > 0 || this.state.fetching) {
            return (
                <View style={styles.container}>
                    <ArxivPaperFlatList
                        data={this.state.papers}
                        refreshing={this.state.fetching}
                        navigation={this.props.navigation}
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
