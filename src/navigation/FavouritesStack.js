import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavouritesListScreen from '../screens/FavouritesListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

import Colors from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function NewStack() {
    return (
        <Stack.Navigator initialRouteName='FavouritesListScreen' screenOptions={{ headerStyle: { backgroundColor: Colors.tintColor, color: '#fff' }, headerTintColor: '#fff' }} >
            <Stack.Screen name='FavouritesListScreen' component={FavouritesListScreen} options={{ title: 'Favourites' }} />
            <Stack.Screen name='PaperScreen' component={PaperScreen} />
            <Stack.Screen name='PDFScreen' component={PDFScreen} />
        </Stack.Navigator >
    );
}