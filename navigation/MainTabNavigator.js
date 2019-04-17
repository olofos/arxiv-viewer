import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';

import NewCategoryListScreen from '../screens/NewCategoryListScreen';
import NewListScreen from '../screens/NewListScreen';

import RecentCategoryListScreen from '../screens/RecentCategoryListScreen';
import RecentListScreen from '../screens/RecentListScreen';

import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

import SettingsScreen from '../screens/SettingsScreen';
import CategorySettingsScreen from '../screens/CategorySettingsScreen';
import AboutScreen from '../screens/AboutScreen';


const NewStack = createStackNavigator(
    {
        CategoryList: NewCategoryListScreen,
        List: NewListScreen,
        Paper: PaperScreen,
        PDF: PDFScreen,
    },
    {
        initialRouteName: 'CategoryList',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Colors.tintColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    },
);

NewStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 2) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
        tabBarLabel: 'New',
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name={
                    Platform.OS === 'ios'
                        ? `ios-pulse${focused ? '' : '-outline'}`
                        : 'md-pulse'
                }
            />
        ),
    };
};

const RecentStack = createStackNavigator(
    {
        CategoryList: RecentCategoryListScreen,
        List: RecentListScreen,
        Paper: PaperScreen,
        PDF: PDFScreen,
    }, {
        initialRouteName: 'CategoryList',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Colors.tintColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    },
);

RecentStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 2) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
        tabBarLabel: 'Recent',
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name={
                    Platform.OS === 'ios'
                        ? `ios-clock${focused ? '' : '-outline'}`
                        : 'md-clock'
                }
            />
        ),
    };
};

const SettingsStack = createStackNavigator(
    {
        Settings: SettingsScreen,
        CategorySettings: CategorySettingsScreen,
        About: AboutScreen,
    }, {
        initialRouteName: 'Settings',
        navigationOptions: {
            headerStyle: {
                backgroundColor: Colors.tintColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    },
);

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    // eslint-disable-next-line react/display-name
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
        />
    ),
};

export default createBottomTabNavigator(
    {
        NewStack,
        RecentStack,
        SettingsStack,
    }, {
        initialRouteName: 'NewStack',
        tabBarOptions: {
            activeTintColor: '#00b386',
        },
    },
);
