import CategoryListScreen from './CategoryListScreen';
import Settings from '../util/Settings';

export default function SetDefaultCategoryListScreen({ navigation }) {
    return (
        <CategoryListScreen
            navigation={navigation}
            title="Default Category"
            onPress={(item) => {
                Settings.setConfig('defaultCategory', item.category);
                navigation.goBack();
            }}
            mark
        />
    );
}
