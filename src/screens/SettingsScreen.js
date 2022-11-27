import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Switch,
    Text,
    Linking,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    Modal,
    useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

import Settings, { useConfigs } from '../util/Settings';
import TitleHeader from '../components/TitleHeader';

function SettingsGroup({ ...props }) {
    return <View className="bg-white dark:bg-gray-700 mb-3">{props.children}</View>;
}

function SettingSwitch({ ...props }) {
    const { colorScheme } = useColorScheme();
    const dark = colorScheme === 'dark';
    const thumbColorOn = dark ? colors.gray[300] : colors.gray[400];
    const thumbColorOff = dark ? colors.gray[400] : colors.gray[200];
    const trackColorOn = dark ? colors.gray[400] : colors.gray[300];
    const trackColorOff = dark ? colors.gray[500] : colors.gray[200];

    return (
        <View className="ml-2 mr-1 h-10 flex-row">
            <Text
                className={`self-center flex-0 text-base ${
                    props.disabled ? 'text-gray-400' : 'text-black dark:text-gray-100'
                }`}
            >
                {props.title}
            </Text>
            <Switch
                className="flex-1"
                value={props.value}
                trackColor={{ true: trackColorOn, false: trackColorOff }}
                thumbColor={props.value ? thumbColorOn : thumbColorOff}
                onValueChange={(value) => props.onValueChange(value)}
                disabled={props.disabled}
            />
        </View>
    );
}

function SettingTouchable({ ...props }) {
    return (
        <TouchableOpacity onPress={() => props.onPress()} underlayColor={colors.gray[300]}>
            <View className="mx-2 h-10 flex-row">
                <Text className="self-center flex-1 text-base dark:text-gray-100">
                    {props.title}
                </Text>

                {props.subtitle ? (
                    <Text className="text-sm flex-0 text-gray-400 self-center">
                        {props.subtitle}
                    </Text>
                ) : null}

                <View className="flex-0 self-center pt-0.5 pl-1">
                    <Ionicons name="chevron-forward" color={colors.gray[400]} size={16} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

function SettingsDivider() {
    return <View className="ml-2 border-b border-gray-200 dark:border-gray-500" />;
}

function SettingsSelect({ ...props }) {
    return (
        <TouchableOpacity
            onPress={(arg) => props.onPress(arg)}
            underlayColor={colors.gray[300]}
            ref={props.innerRef}
            collapsable={false}
        >
            <View className="mx-2 h-10 flex-row">
                <Text className="self-center flex-1 text-base dark:text-gray-100">
                    {props.title}
                </Text>

                {props.subtitle ? (
                    <Text className="text-sm flex-0 text-gray-400 self-center">
                        {props.subtitle}
                    </Text>
                ) : null}

                <View className="flex-0 self-center pt-0.5 pl-1">
                    <Ionicons name="chevron-forward" color={colors.gray[400]} size={16} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

function SettingsSelectPopup({
    visible,
    selected,
    options,
    optionNames,
    onSelect,
    onClose,
    position,
}) {
    const { height: windowHeight } = useWindowDimensions();
    const { colorScheme } = useColorScheme();

    const dark = colorScheme === 'dark';

    if (!position) return null;

    const [, , , height, , pageY] = position;
    const topTop = pageY + height;
    const bottomTop = pageY - options.length * 44;

    return (
        <Modal visible={visible} transparent statusBarTranslucent animationType="fade">
            <TouchableWithoutFeedback
                onPress={() => {
                    onClose();
                }}
            >
                <View className="flex-1">
                    <TouchableWithoutFeedback>
                        <View
                            className="absolute right-1 bg-white border-gray-200 dark:bg-gray-600 dark:border-gray-700 border-2 px-3 rounded-xl"
                            style={topTop < windowHeight / 2 ? { top: topTop } : { top: bottomTop }}
                        >
                            <View className="py-1" />
                            {options.map((option) => (
                                <TouchableOpacity
                                    onPress={() => onSelect(option)}
                                    underlayColor={colors.gray[300]}
                                    key={option}
                                >
                                    <View className="flex-row py-2">
                                        <Text
                                            className={`flex-shrink-0 flex-grow pr-3 text-base ${
                                                option === selected
                                                    ? 'text-black dark:text-gray-50'
                                                    : 'text-gray-800 dark:text-gray-300'
                                            }`}
                                        >
                                            {optionNames[option]}
                                        </Text>
                                        {option === selected && (
                                            <Ionicons
                                                color={dark ? colors.gray[200] : colors.black}
                                                name="checkmark"
                                                size={18}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default function SettingsScreen({ navigation }) {
    const [darkModeSelectState, setDarkModeSelectState] = useState(null);
    const darkModeRef = useRef();
    const [config, setConfig] = useConfigs();
    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleHeader title="Settings" />,
        });
    }, [navigation]);

    const updateConfig = (key, value) => {
        setConfig({ ...config, [key]: value });
        Settings.setConfig(key, value);
    };

    if (!config) {
        return null;
    }

    const darkModeOptions = ['system', 'on', 'off'];
    const darkModeOptionNames = { system: 'System Default', on: 'On', off: 'Off' };

    return (
        <View className="bg-gray-200 dark:bg-gray-600 pt-3 flex-1">
            <SettingsSelectPopup
                title="Dark mode"
                options={darkModeOptions}
                optionNames={darkModeOptionNames}
                selected={config.darkMode}
                onSelect={(option) => {
                    updateConfig('darkMode', option);
                    setDarkModeSelectState(null);
                }}
                position={darkModeSelectState}
                onClose={() => setDarkModeSelectState(null)}
            />
            <SettingsGroup>
                <SettingSwitch
                    onValueChange={(value) => updateConfig('useMathJax', value)}
                    value={config.useMathJax}
                    title="Use MathJax"
                />

                <SettingsDivider />

                <SettingSwitch
                    onValueChange={(value) => updateConfig('openPDFInBrowser', value)}
                    value={config.openPDFInBrowser}
                    title="Open PDFs in external browser"
                />

                <SettingsDivider />

                <SettingTouchable
                    onPress={() => navigation.navigate('SetDefaultCategoryListScreen')}
                    title="Default Category"
                    subtitle={config.defaultCategory || 'none'}
                />

                <SettingsDivider />

                <SettingSwitch
                    onValueChange={(value) => updateConfig('newPapersNotification', value)}
                    value={config.defaultCategory !== 'none' && config.newPapersNotification}
                    title="Send notifications when new papers arrive"
                    disabled={config.defaultCategory === 'none'}
                />

                <SettingsDivider />

                <SettingsSelect
                    onPress={() => {
                        darkModeRef.current.measure((x, y, width, height, pageX, pageY) => {
                            setDarkModeSelectState([x, y, width, height, pageX, pageY]);
                        });
                    }}
                    title="Dark Mode"
                    subtitle={darkModeOptionNames[config.darkMode]}
                    innerRef={darkModeRef}
                />
            </SettingsGroup>

            <SettingsGroup>
                <SettingTouchable
                    onPress={() => Linking.openURL('https://arxiv.org')}
                    title="Go to arxiv.org"
                />
            </SettingsGroup>

            <View className="flex-1" />
            <SettingsGroup>
                <SettingTouchable
                    title="Reset Settings"
                    onPress={() => {
                        Alert.alert(
                            'Reset Settings',
                            'All settings will be set to their default values.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'OK',
                                    onPress: () => Settings.resetConfig(),
                                    style: 'default',
                                },
                            ],
                            { cancelable: true }
                        );
                    }}
                />
            </SettingsGroup>

            <SettingsGroup>
                <SettingTouchable
                    onPress={() => navigation.navigate('AboutScreen')}
                    title="About"
                />
            </SettingsGroup>
        </View>
    );
}
