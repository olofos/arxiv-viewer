import CategoryListScreen from './CategoryListScreen';

export default function NewCategoryListScreen({ navigation }) {
    return (
        <CategoryListScreen
            navigation={navigation}
            title="New Papers"
            onPress={(item) => item.category && navigation.navigate('NewListScreen', item)}
        />
    );
}
