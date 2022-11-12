import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewCategoryListScreen from '../screens/NewCategoryListScreen';
import NewListScreen from '../screens/NewListScreen';
import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

import TitleSubtitleHeader from '../components/TitleSubtitleHeader';
import Colors from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function NewStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: Colors.tintColor, color: '#fff' }, headerTintColor: '#fff' }}>
            <Stack.Screen name='NewCategoryListScreen' component={NewCategoryListScreen} options={{ headerTitle: () => <TitleSubtitleHeader title={'New Papers'} subtitle={'Pick a category'} /> }} />
            <Stack.Screen name='NewListScreen' component={NewListScreen} />
            <Stack.Screen name='PaperScreen' component={PaperScreen} />
            <Stack.Screen name='PDFScreen' component={PDFScreen} />
        </Stack.Navigator>
    );
}