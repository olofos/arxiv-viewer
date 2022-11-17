import * as React from 'react';
import colors from 'tailwindcss/colors';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavouritesListScreen from '../screens/FavouritesListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

const Stack = createNativeStackNavigator();

export default function NewStack() {
    return (
        <Stack.Navigator
            initialRouteName="FavouritesListScreen"
            screenOptions={{
                headerStyle: { backgroundColor: colors.gray[500] },
                headerTintColor: colors.white,
            }}
        >
            <Stack.Screen name="FavouritesListScreen" component={FavouritesListScreen} />
            <Stack.Screen name="PaperScreen" component={PaperScreen} />
            <Stack.Screen name="PDFScreen" component={PDFScreen} />
        </Stack.Navigator>
    );
}
