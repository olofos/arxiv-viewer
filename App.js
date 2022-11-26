import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useRNColorScheme } from 'react-native';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import NewBackgroundFetcher from './src/components/NewBackgroundFetcher';
import { useConfig } from './src/util/Settings';

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.gray[600],
        text: colors.gray[400],
        border: colors.gray[200],
        card: colors.gray[100],
        background: colors.white,
    },
};

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.gray[400],
        text: colors.gray[600],
        border: colors.gray[800],
        card: colors.gray[800],
        background: colors.gray[800],
    },
};

export default function App() {
    const systemColorScheme = useRNColorScheme();
    const { setColorScheme } = useColorScheme();
    const darkMode = useConfig('darkMode');

    const dark = darkMode === 'on' || (darkMode === 'system' && systemColorScheme === 'dark');
    useEffect(() => {
        setColorScheme(dark ? 'dark' : 'light');
    }, [setColorScheme, dark]);

    return (
        <NavigationContainer theme={dark ? DarkTheme : Theme}>
            <NewBackgroundFetcher />
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="light" />
            <MainTabNavigator />
        </NavigationContainer>
    );
}
