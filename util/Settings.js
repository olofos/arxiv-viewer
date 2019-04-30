import {
    AsyncStorage,
} from 'react-native';

import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

const defaultConfig = { defaultCategory: null, useMathJax: true };

const eventEmitter = new EventEmitter();


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
                    .then(() => {
                        eventEmitter.emit('config-updated', config);
                        return config;
                    });
            });
    }

    static getFavourites() {
        return AsyncStorage.getItem('favourites')
            .then(JSON.parse)
            .then(favourites => favourites || []);
    }

    static toggleFavourite(id) {
        return Settings.getFavourites()
            .then((favourites) => {
                const index = favourites.findIndex(elem => elem === id);
                let newFavourites;
                if (index >= 0) {
                    newFavourites = [...favourites.slice(0, index), ...favourites.slice(index + 1)];
                } else {
                    newFavourites = [...favourites, id];
                }
                console.log(`new: ${newFavourites}`);
                return AsyncStorage.setItem('favourites', JSON.stringify(newFavourites)).then(() => newFavourites);
            })
            .then((favourites) => {
                eventEmitter.emit('favourites-updated', favourites);
                return favourites;
            });
    }

    static addEventListener(eventName, handler) {
        return eventEmitter.addListener(eventName, handler);
    }
}
