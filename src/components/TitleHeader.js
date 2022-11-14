import { StyleSheet, Text, View } from 'react-native';

export default function TitleHeader({ title }) {
    return (
        <View>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#fff',
    },
});
