import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

export default function TabBarIcon({ name, focused }) {
    return <Ionicons name={name} size={26} color={focused ? colors.gray[500] : colors.gray[300]} />;
}
