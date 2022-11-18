import CategoryListScreen from './CategoryListScreen';

export default function NewCategoryListScreen({ navigation }) {
    return (
        <CategoryListScreen
            navigation={navigation}
            title="Recent Papers"
            onPress={(item) => item.category && navigation.navigate('RecentListScreen', item)}
        />
    );
}
