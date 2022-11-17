import { Text, View } from 'react-native';

export default function TitleSubtitleHeader({ title, subtitle }) {
    return (
        <View className="flex-column pb-1">
            <Text className="text-lg font-semibold text-white">{title}</Text>
            <Text className="text-xs text-white">{subtitle}</Text>
        </View>
    );
}
