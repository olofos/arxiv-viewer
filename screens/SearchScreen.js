import React from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    TextInput,
} from 'react-native';

import { Icon } from 'react-native-elements';
import Arxiv from '../util/Arxiv';

// import Arxiv from '../util/Arxiv';

class SearchBox extends React.Component {
    constructor() {
        super();
        this.state = { text: '', showError: false };
    }

    render() {
        return (
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    < TextInput
                        style={{ height: 40, flex: 1 }}
                        placeholder={this.props.placeholder}
                        underlineColorAndroid="transparent"
                        returnKeyType="search"
                        value={this.state.text}
                        ref={(ref) => { this.textInput = ref; }}
                        onChangeText={(text) => {
                            let { showError } = this.state;
                            if (showError) {
                                showError = !(this.props.validate && this.props.validate(text));
                            }
                            this.setState({ text, showError });
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}

                        onSubmitEditing={() => {
                            const text = this.state.text.trim();
                            const valid = this.props.validate ? this.props.validate(text) : true;
                            this.setState({ showError: !valid });

                            if (valid) {
                                this.props.onSubmit(text);
                            }
                        }}
                    />
                    <TouchableHighlight onPress={() => { this.setState({ text: '' }); this.textInput.blur(); }}>
                        <Icon type="material" name={this.state.text === '' ? 'search' : 'close'} color='#aaa' containerStyle={{ flex: 0 }} />
                    </TouchableHighlight>
                </View>
                {this.props.validate ? (
                    <View>
                        <Text>{this.state.showError ? this.props.errorMessage : ' '}</Text>
                    </View>
                ) : null}
            </View>
        );
    }
}

export default class SearchScreen extends React.Component {
    static navigationOptions = {
        title: 'Search',
    };

    render() {
        return (
            <View style={styles.container}>
                <SearchBox
                    placeholder="Search id"
                    onSubmit={(text) => {
                        this.props.navigation.navigate('List', { query: { ids: text } });
                    }}
                    validate={text => text.split(/[\s,]/).filter(s => s.length > 0).every(Arxiv.isValidId)}
                    errorMessage="Please provide a valid arXiv id"
                />

                <SearchBox
                    placeholder="Search author"
                    onSubmit={(text) => {
                        this.props.navigation.navigate('List', { query: { authors: text } });
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    searchContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingLeft: 4,
        paddingRight: 4,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
