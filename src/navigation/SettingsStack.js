import * as React from 'react';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import SetDefaultCategoryListScreen from '../screens/SetDefaultCategoryListScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
    const { colorScheme } = useColorScheme();
    return (
        <Stack.Navigator
            initialRouteName="SettingsScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme === 'dark' ? colors.gray[900] : colors.gray[500],
                },
                headerTintColor: colorScheme === 'dark' ? colors.gray[200] : colors.white,
            }}
        >
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} />
            <Stack.Screen
                name="SetDefaultCategoryListScreen"
                component={SetDefaultCategoryListScreen}
            />
        </Stack.Navigator>
    );
}
