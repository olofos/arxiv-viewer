import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableHighlight,
    Switch,
    Text,
    Modal,
    AsyncStorage,
} from 'react-native';

import { Icon } from 'react-native-elements';

import Arxiv from '../util/Arxiv';

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    constructor(props) {
        super(props);
        this.state = { loaded: false, config: null, modalVisible: false };
        this.categories = ['none'].concat(...Arxiv.categories.map(sect => sect.data.map(cat => cat.category)));
    }

    componentDidMount() {
        AsyncStorage.getItem('config')
            .then(JSON.parse)
            .then((config) => {
                this.setState({ config, loaded: true });
            });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        if (!this.state.loaded) {
            return null;
        } else {
            const { config } = this.state;
            return (
                <View style={styles.container}>
                    <Modal
                        animationType={'slide'}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => this.setModalVisible(false)}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            < View style={{ marginBottom: 48, marginTop: 48, marginLeft: 24, marginRight: 24, padding: 4, flex: 1, backgroundColor: '#fff' }}>
                                <View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 1,
                                        paddingBottom: 4,
                                        paddingTop: 4,
                                    }}>
                                        <View style={{ width: 24 }}></View>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            flex: 1,
                                        }}>Default Category</Text>
                                    </View>
                                    <FlatList
                                        initialScrollIndex={
                                            config.defaultCategory ? this.categories.findIndex(el => el === config.defaultCategory) : 0
                                        }
                                        getItemLayout={(data, index) => ({ length: 24, offset: 24 * index, index })}
                                        data={this.categories}
                                        keyExtractor={item => item}
                                        renderItem={({ item }) => {
                                            const selected = (item === config.defaultCategory) || (!config.defaultCategory && item === 'none');
                                            return (
                                                <TouchableHighlight
                                                    style={{ height: 24 }}
                                                    onPress={() => {
                                                        const conf = this.state.config;
                                                        if (item === 'none') {
                                                            conf.defaultCategory = undefined;
                                                        } else {
                                                            conf.defaultCategory = item;
                                                        }
                                                        this.updateConfig(conf)
                                                            .then(() => this.setModalVisible(false));
                                                    }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={{ width: 24 }}>
                                                            {selected ? <Icon name='check' type='material' size={18} /> : null}
                                                        </View>
                                                        <Text style={{
                                                            fontSize: 16,
                                                            paddingBottom: 2,
                                                            paddingTop: 2,
                                                            flex: 1,
                                                        }}>{item}</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            );
                                        }}>
                                    </FlatList>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={{ marginTop: 15, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1 }}>
                        <View style={{ marginLeft: 15, height: 50, flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                flex: 1,
                                alignSelf: 'center',
                            }}>Use MathJax</Text>
                            <Switch
                                style={{ marginRight: 15, flex: 1, justifyContent: 'center' }}
                                value={config.useMathJax}
                                onValueChange={value => this.onUseMathJaxChange(value)} />
                        </View>

                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(true);
                            }}>
                            <View style={{ marginLeft: 15, height: 50, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 16,
                                    flex: 0,
                                    alignSelf: 'center',
                                }}>
                                    Default Category
                                </Text>

                                <Text style={{
                                    marginRight: 15,
                                    fontSize: 14,
                                    flex: 1,
                                    alignSelf: 'center',
                                    textAlign: 'right',
                                    color: '#aaa',
                                }}>
                                    {config.defaultCategory || 'none'}
                                </Text>

                                <Icon type='material' name='chevron-right' color='#aaa' containerStyle={{
                                    flex: 0,
                                    marginRight: 15,
                                    alignSelf: 'center',
                                }} />
                            </View>
                        </TouchableHighlight>
                    </View>

                    <View style={{ flex: 1 }}></View>

                    <View style={{ marginBottom: 15, backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, flex: 0 }}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('About')}>
                            <View style={{ marginLeft: 15, height: 50, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 16,
                                    flex: 1,
                                    alignSelf: 'center',
                                }}>
                                    About
                                </Text>
                                <Icon type='material' name='chevron-right' color='#aaa' containerStyle={{
                                    flex: 0,
                                    marginRight: 15,
                                    alignSelf: 'center',
                                }} />
                            </View>
                        </TouchableHighlight>
                    </View>
                </View >
            );
        }
    }

    updateConfig(config) {
        return AsyncStorage.setItem('config', JSON.stringify(config))
            .then(() => this.setState({ config }));
    }

    onUseMathJaxChange(value) {
        const { config } = this.state;
        config.useMathJax = value;
        this.updateConfig(config);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
});
