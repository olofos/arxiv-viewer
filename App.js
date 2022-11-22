import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import colors from 'tailwindcss/colors';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import NewBackgroundFetcher from './src/components/NewBackgroundFetcher';

const Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        // primary: Colors.tintColor,
        primary: colors.gray[800],
        text: colors.gray[500],
        border: colors.gray[300],
        card: colors.white,
        background: colors.white,
    },
};

export default function App() {
    return (
        <NavigationContainer theme={Theme}>
            <NewBackgroundFetcher />
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="light" />
            <MainTabNavigator />
        </NavigationContainer>
    );
}
