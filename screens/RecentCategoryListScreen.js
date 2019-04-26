import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import ArxivCategoryList from '../components/ArxivCategoryList';
import Settings from '../util/Settings';

export default class RecentCategoryListScreen extends React.Component {
    static navigationOptions = {
        title: 'Recent Papers',
    };

    goToCategory(cat) {
        console.log(`Going to category ${cat.category}`);
        if (cat.category) {
            this.props.navigation.navigate('List', cat);
        }
    }

    componentDidMount() {
        Settings.getConfig('defaultCategory')
            .then(category => this.categoryList.scrollToCategory(category));
    }

    render() {
        return (
            <View style={styles.container}>
                <ArxivCategoryList
                    navigation={this.props.navigation}
                    onPress={item => this.goToCategory(item)}
                    ref={(categoryList) => { this.categoryList = categoryList; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
