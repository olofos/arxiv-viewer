import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Arxiv from '../util/Arxiv';
import Settings from '../util/Settings';
import ArxivPaperFlatList from '../components/ArxivPaperFlatList';

export default class FavouritesListScreen extends React.Component {
    static navigationOptions = {
        title: 'Favourites',
    };

    constructor(props) {
        super(props);
        this.state = { favouritePapers: [], fetching: false };
    }

    updateFavourites(favouriteIds) {
        if (favouriteIds.length > 0) {
            this.setState({ fetching: true });
            Arxiv.fetchPapersById(favouriteIds)
                .then(papers => this.setState({ favouritePapers: papers, fetching: false }));
        } else {
            this.setState({ favouritePapers: [] });
        }
    }

    componentDidMount() {
        Settings.getFavourites()
            .then(favouriteIds => this.updateFavourites(favouriteIds));

        this.favouriteListener = Settings.addEventListener('favourites-updated', favouriteIds => this.updateFavourites(favouriteIds));
    }

    componentWillUnmount() {
        if (this.favouriteListener) {
            this.favouriteListener.remove();
        }
    }

    render() {
        if (this.state.favouritePapers.length > 0) {
            return (
                <View style={styles.container}>
                    <ArxivPaperFlatList
                        data={this.state.favouritePapers}
                        refreshing={this.state.fetching}
                        navigation={this.props.navigation}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Text style={{ fontStyle: 'italic', padding: 8 }}>No favourites added</Text>
                    <Text style={{ fontStyle: 'italic', paddingLeft: 8, paddingRight: 8 }}>Add a paper as a favourite by tapping the star icon</Text>
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
