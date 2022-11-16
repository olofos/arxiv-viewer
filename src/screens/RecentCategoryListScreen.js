import CategoryListScreen from './CategoryListScreen';

export default function NewCategoryListScreen({ navigation }) {
    return (
        <CategoryListScreen
            navigation={navigation}
            title="Recent Papers"
            screen="RecentListScreen"
        />
    );
}
