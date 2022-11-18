import * as React from 'react';
import colors from 'tailwindcss/colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import SetDefaultCategoryListScreen from '../screens/SetDefaultCategoryListScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
    return (
        <Stack.Navigator
            initialRouteName="SettingsScreen"
            screenOptions={{
                headerStyle: { backgroundColor: colors.gray[500] },
                headerTintColor: colors.white,
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
