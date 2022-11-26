import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

export default function TabBarIcon({ name, focused }) {
    const { colorScheme } = useColorScheme();
    const dark = colorScheme === 'dark';

    const focusedColor = dark ? colors.gray[400] : colors.gray[500];
    const unfocusedColor = dark ? colors.gray[600] : colors.gray[300];
    return <Ionicons name={name} size={26} color={focused ? focusedColor : unfocusedColor} />;
}
