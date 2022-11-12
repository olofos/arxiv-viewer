import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function TitleSubtitleHeader({ title, subtitle }) {
    return (
        <View>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View >
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },

    headerSubtitle: {
        fontSize: 12,
        color: '#fff',
    },
});