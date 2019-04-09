import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ArxivCategoryList from '../components/ArxivCategoryList';

export default class RecentCategoryListScreen extends React.Component {
    static navigationOptions = {
        title: 'Recent Papers',
    };

    goToCategory(cat) {
        console.log(`Going to category ${cat.category}`);
        if(cat.category) {
            this.props.navigation.navigate('List', cat);
        }
    }


    render() {
        return (
            <View style={styles.container}>
              <ArxivCategoryList navigation={this.props.navigation} onPress={(item) => this.goToCategory(item)}/>
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
