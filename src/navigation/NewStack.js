import * as React from 'react';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewCategoryListScreen from '../screens/NewCategoryListScreen';
import NewListScreen from '../screens/NewListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

const Stack = createNativeStackNavigator();

export default function NewStack() {
    const { colorScheme } = useColorScheme();
    const dark = colorScheme === 'dark';
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: dark ? colors.gray[900] : colors.gray[500],
                },
                headerTintColor: dark ? colors.gray[200] : colors.white,
            }}
        >
            <Stack.Screen name="NewCategoryListScreen" component={NewCategoryListScreen} />
            <Stack.Screen name="NewListScreen" component={NewListScreen} />
            <Stack.Screen name="PaperScreen" component={PaperScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
        </Stack.Navigator>
    );
}
