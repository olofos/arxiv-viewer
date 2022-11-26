import * as React from 'react';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecentCategoryListScreen from '../screens/RecentCategoryListScreen';
import RecentListScreen from '../screens/RecentListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

const Stack = createNativeStackNavigator();

export default function RecentStack() {
    const { colorScheme } = useColorScheme();
    return (
        <Stack.Navigator
            initialRouteName="RecentCategoryListScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? colors.gray[900] : colors.gray[500],
                },
                headerTintColor: colorScheme === 'dark' ? colors.gray[200] : colors.white,
            }}
        >
            <Stack.Screen name="RecentCategoryListScreen" component={RecentCategoryListScreen} />
            <Stack.Screen name="RecentListScreen" component={RecentListScreen} />
            <Stack.Screen name="PaperScreen" component={PaperScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
        </Stack.Navigator>
    );
}
