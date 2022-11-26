import { Text, View } from 'react-native';

export default function TitleHeader({ title }) {
    return (
        <View className="">
            <Text className="text-2xl font-semibold text-white dark:text-gray-200">{title}</Text>
        </View>
    );
}
