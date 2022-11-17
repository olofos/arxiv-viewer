import { Text, View } from 'react-native';

export default function TitleHeader({ title }) {
    return (
        <View className="">
            <Text className="text-2xl font-semibold text-white">{title}</Text>
        </View>
    );
}
