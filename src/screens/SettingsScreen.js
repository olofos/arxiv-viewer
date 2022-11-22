import React, { useEffect } from 'react';
import { View, Switch, Text, Linking, TouchableOpacity, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import Settings, { useConfigs } from '../util/Settings';
import TitleHeader from '../components/TitleHeader';

function SettingsGroup({ ...props }) {
    return <View className="bg-white mb-3">{props.children}</View>;
}

function SettingSwitch({ ...props }) {
    return (
        <View className="ml-2 mr-1 h-10 flex-row">
            <Text
                className={`self-center flex-0 text-base ${
                    props.disabled ? 'text-gray-400' : 'text-black'
                }`}
            >
                {props.title}
            </Text>
            <Switch
                className="flex-1"
                value={props.value}
                thumbColor={props.value ? colors.gray[400] : colors.gray[200]}
                trackColor={{ true: colors.gray[300], false: colors.gray[200] }}
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
                <Text className="self-center flex-1 text-base">{props.title}</Text>

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
    return <View className="ml-2 border-b border-gray-200" />;
}

export default function SettingsScreen({ navigation }) {
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

    return (
        <View className="bg-gray-200 pt-3 flex-1">
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
