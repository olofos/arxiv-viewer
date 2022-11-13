import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecentCategoryListScreen from '../screens/RecentCategoryListScreen';
import RecentListScreen from '../screens/RecentListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

import TitleSubtitleHeader from '../components/TitleSubtitleHeader';
import Colors from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function RecentStack() {
    return (
        <Stack.Navigator
            initialRouteName="SettingsScreen"
            screenOptions={{
                headerStyle: { backgroundColor: Colors.tintColor, color: '#fff' },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen
                name="RecentCategoryListScreen"
                component={RecentCategoryListScreen}
                options={{
                    // eslint-disable-next-line react/no-unstable-nested-components
                    headerTitle: () => (
                        <TitleSubtitleHeader title="Recent Papers" subtitle="Pick a category" />
                    ),
                }}
            />
            <Stack.Screen name="RecentListScreen" component={RecentListScreen} />
            <Stack.Screen name="PaperScreen" component={PaperScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
        </Stack.Navigator>
    );
}
