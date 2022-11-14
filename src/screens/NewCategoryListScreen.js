import { StyleSheet, View } from 'react-native';

import ArxivCategoryList from '../components/ArxivCategoryList';
import { useConfigOnce } from '../util/Settings';

export default function NewCategoryListScreen({ ...props }) {
    const defaultCategory = useConfigOnce('defaultCategory');

    const goToCategory = (cat) => {
        if (cat.category) {
            props.navigation.navigate('NewListScreen', cat);
        }
    };
    return (
        <View style={styles.container}>
            <ArxivCategoryList
                defaultCategory={defaultCategory}
                navigation={props.navigation}
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
