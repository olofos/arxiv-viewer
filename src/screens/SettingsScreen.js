import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    TouchableHighlight,
    Switch,
    Text,
    Modal,
    Linking,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import Arxiv from '../util/Arxiv';
import Settings from '../util/Settings';
import TitleHeader from '../components/TitleHeader';

function SettingsGroup({ ...props }) {
    return <View className="bg-white mb-3">{props.children}</View>;
}

function SettingSwitch({ ...props }) {
    return (
        <View className="ml-2 mr-1 h-10 flex-row">
            <Text className="self-center flex-0 text-base">{props.title}</Text>
            <Switch
                className="flex-1"
                value={props.value}
                thumbColor={props.value ? colors.gray[400] : colors.gray[200]}
                trackColor={{ true: colors.gray[300], false: colors.gray[200] }}
                onValueChange={(value) => props.onValueChange(value)}
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

function SelectableFlatList({ ...props }) {
    const height = 24;
    return (
        <FlatList
            initialScrollIndex={
                props.selectedItem ? props.data.findIndex((el) => el === props.selectedItem) : 0
            }
            getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
            data={props.data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
                const selected = item === props.selectedItem;
                return (
                    <TouchableHighlight
                        underlayColor="#b2dfdc"
                        style={{ height }}
                        onPress={() => props.onPress(item)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 24 }}>
                                {selected ? <Ionicons name="checkmark" size={18} /> : null}
                            </View>
                            <Text
                                style={{ fontSize: 16, paddingBottom: 2, paddingTop: 2, flex: 1 }}
                            >
                                {item}
                            </Text>
                        </View>
                    </TouchableHighlight>
                );
            }}
        />
    );
}

function SelectableFlatListModal({ ...props }) {
    return (
        <Modal
            animationType="slide"
            transparent
            visible={props.visible}
            onRequestClose={() => props.onRequestClose()}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <View
                    style={{
                        marginBottom: 48,
                        marginTop: 48,
                        marginLeft: 24,
                        marginRight: 24,
                        padding: 4,
                        flex: 1,
                        backgroundColor: '#fff',
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingBottom: 4,
                                paddingTop: 4,
                            }}
                        >
                            <View style={{ width: 24 }} />
                            <Text style={{ fontSize: 20, fontWeight: '500', flex: 1 }}>
                                {props.title}
                            </Text>
                        </View>

                        <SelectableFlatList
                            data={props.data}
                            selectedItem={props.selectedItem}
                            onPress={(item) => props.onSelect(item)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function SettingsDivider() {
    return <View className="ml-2 border-b border-gray-200" />;
}

export default function SettingsScreen({ navigation }) {
    const [config, setConfig] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const categories = ['none'].concat(
        ...Arxiv.categories.map((sect) => sect.data.map((cat) => cat.category))
    );

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerTitle: () => <TitleHeader title="Settings" />,
        });
    }, [navigation]);

    useEffect(() => {
        const getConfig = async () => {
            const theConfig = await Settings.getConfig();
            setConfig(theConfig);
        };

        getConfig();
    }, []);

    if (!config) {
        return null;
    }

    const updateConfig = (key, value) => {
        setConfig({ ...config, [key]: value });
        Settings.setConfig(key, value).then((newConfig) => setConfig(newConfig));
    };

    return (
        <View className="bg-gray-200 pt-3 flex-1">
            <SelectableFlatListModal
                visible={modalVisible}
                title="Default Category"
                data={categories}
                selectedItem={config.defaultCategory || 'none'}
                onRequestClose={() => setModalVisible(false)}
                onSelect={(item) => {
                    updateConfig('defaultCategory', item);
                    setModalVisible(false);
                }}
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
                    onPress={() => setModalVisible(true)}
                    title="Default Category"
                    subtitle={config.defaultCategory || 'none'}
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
                    onPress={() => navigation.navigate('AboutScreen')}
                    title="About"
                />
            </SettingsGroup>
        </View>
    );
}
