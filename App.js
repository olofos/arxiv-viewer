import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainTabNavigator from './src/navigation/MainTabNavigator';

import Colors from './src/constants/Colors';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.tintColor,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" />
      <MainTabNavigator />
    </NavigationContainer>
  );
}
