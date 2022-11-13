import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import SettingsStack from './SettingsStack';
import NewStack from './NewStack';
import RecentStack from './RecentStack';
import FavouritesStack from './FavouritesStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="NewStack"
                component={NewStack}
                options={{
                    title: 'New',
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ focused }) => <TabBarIcon name="pulse" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="RecentStack"
                component={RecentStack}
                options={{
                    title: 'Recent',
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'time' : 'time-outline'} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="FavouritesStack"
                component={FavouritesStack}
                options={{
                    title: 'Favourite',
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'star' : 'star-outline'} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsStack"
                component={SettingsStack}
                options={{
                    title: 'Settings',
                    // eslint-disable-next-line react/no-unstable-nested-components
                    tabBarIcon: ({ focused }) => <TabBarIcon name="options" focused={focused} />,
                }}
            />
        </Tab.Navigator>
    );
}
