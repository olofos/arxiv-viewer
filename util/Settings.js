import {
    AsyncStorage,
} from 'react-native';

const defaultConfig = { defaultCategory: null, useMathJax: true };

export default class Settings {
    static getConfig(key) {
        return AsyncStorage.getItem('config')
            .then(JSON.parse)
            .then(config => config || defaultConfig)
            .then((config) => {
                if (key) {
                    return config[key];
                } else {
                    return config;
                }
            });
    }

    static setConfig(key, value) {
        return Settings.getConfig()
            .then((config) => {
                config[key] = value;
                return AsyncStorage.setItem('config', JSON.stringify(config))
                    .then(() => config);
            });
    }
}
