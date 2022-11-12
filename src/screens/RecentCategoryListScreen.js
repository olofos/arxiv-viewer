import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import ArxivCategoryList from '../components/ArxivCategoryList';
import Settings from '../util/Settings';

export default function RecentCategoryListScreen({ navigation }) {
    const [defaultCategory, setDefaultCategory] = useState();

    useEffect(() => {
        Settings.getConfig('defaultCategory')
            .then(category => setDefaultCategory(category));
    }, []);

    const goToCategory = (cat) => {
        console.log(`Going to category ${cat.category}`);
        if (cat.category) {
            navigation.navigate('RecentListScreen', cat);
        }
    }

    return (
        <View style={styles.container}>
            <ArxivCategoryList
                defaultCategory={defaultCategory}
                navigation={navigation}
                onPress={item => goToCategory(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
