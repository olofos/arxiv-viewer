import { useEffect } from 'react';

import ArxivCategoryList from '../components/ArxivCategoryList';
import { useConfigOnce } from '../util/Settings';
import TitleSubtitleHeader from '../components/TitleSubtitleHeader';

export default function CategoryListScreen({ navigation, title, screen }) {
    const defaultCategory = useConfigOnce('defaultCategory');

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleSubtitleHeader title={title} subtitle="Pick a category" />,
        });
    });

    if (!defaultCategory) return null;

    const goToCategory = (cat) => {
        if (cat.category) {
            navigation.navigate(screen, cat);
        }
    };

    return (
        <ArxivCategoryList
            defaultCategory={defaultCategory}
            navigation={navigation}
            onPress={(item) => goToCategory(item)}
        />
    );
}
