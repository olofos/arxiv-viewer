import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import ArxivPaperList from '../components/ArxivPaperList';
import Arxiv from '../util/Arxiv';

import { groupBy } from '../util/Util';

export default class RecentListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('category', 'Unkown'),
    });

    constructor(props) {
        super(props);
        this.state = { sections: [], numLoaded: 0, fetching: false };
    }

    fetchMorePapers() {
        this.setState({ fetching: true });
        Arxiv.fetchRecent(this.props.navigation.getParam('category'), this.state.numLoaded, 25)
            .then((result) => {
                const papers = groupBy(result, p => p.updated.toISOString().slice(0, 10));
                const newSections = Object.keys(papers).map(k => (
                    { title: k, data: papers[k] }
                ));

                let { sections } = this.state;

                newSections.forEach((entry) => {
                    const index = sections.findIndex(oldEntry => oldEntry.title === entry.title);
                    if (index >= 0) {
                        sections[index].data = sections[index].data.concat(entry.data);
                    } else {
                        sections = sections.concat(entry);
                    }
                });

                const numLoaded = this.state.numLoaded + result.length;

                this.setState({ sections, fetching: false, numLoaded });
            });
    }

    componentDidMount() {
        this.fetchMorePapers();
    }

    render() {
        return (
            <View style={styles.container}>
                <ArxivPaperList
                    sections={this.state.sections}
                    onEndReached={() => this.fetchMorePapers()}
                    refreshing={this.state.fetching}
                    navigation={this.props.navigation}
                    onRefresh={() => {
                        this.setState({ sections: [], numLoaded: 0 });
                        this.fetchMorePapers();
                    }}
                />
            </View>
        );
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
        backgroundColor: '#ccc',
    },
});
