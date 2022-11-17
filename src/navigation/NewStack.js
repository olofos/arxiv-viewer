import * as React from 'react';
import colors from 'tailwindcss/colors';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewCategoryListScreen from '../screens/NewCategoryListScreen';
import NewListScreen from '../screens/NewListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

const Stack = createNativeStackNavigator();

export default function NewStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.gray[500] },
                headerTintColor: colors.white,
            }}
        >
            <Stack.Screen name="NewCategoryListScreen" component={NewCategoryListScreen} />
            <Stack.Screen name="NewListScreen" component={NewListScreen} />
            <Stack.Screen name="PaperScreen" component={PaperScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
        </Stack.Navigator>
    );
}
