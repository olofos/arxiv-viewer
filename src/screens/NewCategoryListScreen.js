import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import ArxivCategoryList from '../components/ArxivCategoryList';
import { useConfigOnce } from '../util/Settings';
import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

export default function NewCategoryListScreen({ navigation }) {
    const defaultCategory = useConfigOnce('defaultCategory');

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => (
                <TitleSubtitleHeader title="New Papers" subtitle="Pick a category" />
            ),
        });
    });

    const goToCategory = (cat) => {
        if (cat.category) {
            navigation.navigate('NewListScreen', cat);
        }
    };
    return (
        <View style={styles.container}>
            <ArxivCategoryList
                defaultCategory={defaultCategory}
                navigation={navigation}
                onPress={(item) => goToCategory(item)}
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
