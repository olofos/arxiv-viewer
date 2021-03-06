import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';

import NewCategoryListScreen from '../screens/NewCategoryListScreen';
import NewListScreen from '../screens/NewListScreen';

import RecentCategoryListScreen from '../screens/RecentCategoryListScreen';
import RecentListScreen from '../screens/RecentListScreen';

import FavouritesListScreen from '../screens/FavouritesListScreen';

import SearchScreen from '../screens/SearchScreen';
import SearchListScreen from '../screens/SearchListScreen';

import PaperScreen from '../screens/PaperScreen';
import PDFScreen from '../screens/PDFScreen';

import SettingsScreen from '../screens/SettingsScreen';
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
        defaultNavigationOptions: {
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
    },
    {
        initialRouteName: 'CategoryList',
        defaultNavigationOptions: {
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

const FavouritesStack = createStackNavigator(
    {
        List: FavouritesListScreen,
        Paper: PaperScreen,
        PDF: PDFScreen,
    },
    {
        initialRouteName: 'List',
        defaultNavigationOptions: {
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

FavouritesStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 2) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
        tabBarLabel: 'Favourites',
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name={
                    Platform.OS === 'ios'
                        ? `ios-star${focused ? '' : '-outline'}`
                        : 'md-star'
                }
            />
        ),
    };
};

const SearchStack = createStackNavigator(
    {
        Search: SearchScreen,
        List: SearchListScreen,
        Paper: PaperScreen,
        PDF: PDFScreen,
    },
    {
        initialRouteName: 'Search',
        defaultNavigationOptions: {
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

SearchStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 2) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
        tabBarLabel: 'Search',
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused }) => (
            <TabBarIcon
                focused={focused}
                name={
                    Platform.OS === 'ios'
                        ? `ios-search${focused ? '' : '-outline'}`
                        : 'md-search'
                }
            />
        ),
    };
};

const SettingsStack = createStackNavigator(
    {
        Settings: SettingsScreen,
        About: AboutScreen,
    },
    {
        initialRouteName: 'Settings',
        defaultNavigationOptions: {
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

export default createAppContainer(createBottomTabNavigator(
    {
        NewStack,
        RecentStack,
        SearchStack,
        FavouritesStack,
        SettingsStack,
    },
    {
        initialRouteName: 'NewStack',
        tabBarOptions: {
            activeTintColor: '#00b386',
        },
    },
));
