import React from 'react';
import * as Icon from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon({ name, focused }) {
    return (
        <Icon.Ionicons
            name={name}
            size={26}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
    );
}
