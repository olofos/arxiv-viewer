import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableHighlight,
    Switch,
    Text,
    Modal,
    Linking,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Arxiv from '../util/Arxiv';
import Settings from '../util/Settings';

function SettingsGroup({ ...props }) {
    return <View style={[styles.group, props.style]}>{props.children}</View>;
}

function SettingSwitch({ ...props }) {
    return (
        <View style={[styles.switchContainer, props.style]}>
            <Text style={styles.switchText}>{props.title}</Text>
            <Switch
                style={styles.switch}
                value={props.value}
                thumbColor={props.value ? '#00b386' : '#9b9b9b'}
                trackColor={{ true: '#abe3d5', false: '#c7c7c7' }}
                onValueChange={(value) => props.onValueChange(value)}
            />
        </View>
    );
}

function SettingTouchable({ ...props }) {
    return (
        <TouchableHighlight onPress={() => props.onPress()} underlayColor="#b2dfdc">
            <View style={[styles.touchableContainer, props.style]}>
                <Text style={styles.touchableText}>{props.title}</Text>

                {props.subtitle ? (
                    <Text style={styles.touchableSubtitle}>{props.subtitle}</Text>
                ) : null}

                <View style={styles.touchableIcon}>
                    <Ionicons name="chevron-forward" color="#aaa" size={16} />
                </View>
            </View>
        </TouchableHighlight>
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
                                borderBottomWidth: 1,
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
    return <View style={styles.divider} />;
}

export default function SettingsScreen({ navigation }) {
    const [config, setConfig] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const categories = ['none'].concat(
        ...Arxiv.categories.map((sect) => sect.data.map((cat) => cat.category))
    );

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
        <View style={styles.container}>
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

            <View style={{ flex: 1 }} />

            <SettingsGroup style={{}}>
                <SettingTouchable onPress={() => navigation.navigate('About')} title="About" />
            </SettingsGroup>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        paddingBottom: 16,
    },
    group: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d8d8d8',
    },
    switchContainer: {
        marginLeft: 16,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#d8d8d8',
    },
    switchText: {
        fontSize: 16,
        flex: 1,
        alignSelf: 'center',
    },
    switch: {
        marginRight: 15,
        flex: 1,
        justifyContent: 'center',
    },
    touchableContainer: {
        marginLeft: 16,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#d8d8d8',
    },
    touchableText: {
        fontSize: 16,
        flex: 1,
        alignSelf: 'center',
    },
    touchableSubtitle: {
        marginRight: 16,
        fontSize: 14,
        flex: 0,
        alignSelf: 'center',
        textAlign: 'right',
        color: '#aaa',
    },
    touchableIcon: {
        flex: 0,
        marginRight: 15,
        alignSelf: 'center',
    },
    divider: {
        marginLeft: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#d8d8d8',
        borderBottomWidth: 1,
    },
});