import AsyncStorage from '@react-native-async-storage/async-storage';

import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

import { useState, useEffect } from 'react';

const defaultConfig = { defaultCategory: null, useMathJax: true };

const eventEmitter = new EventEmitter();

export default class Settings {
    static getConfig(key) {
        return AsyncStorage.getItem('config')
            .then(JSON.parse)
            .then((config) => config || defaultConfig)
            .then((config) => {
                if (key) {
                    return config[key];
                }
                return config;
            });
    }

    static setConfig(key, value) {
        return Settings.getConfig().then((config) => {
            const newConfig = { ...config, [key]: value };
            return AsyncStorage.setItem('config', JSON.stringify(newConfig)).then(() => {
                eventEmitter.emit('config-updated', newConfig);
                return newConfig;
            });
        });
    }

    static getFavourites() {
        return AsyncStorage.getItem('favourites')
            .then(JSON.parse)
            .then((favourites) => favourites || []);
    }

    static setFavourites(newFavourites) {
        AsyncStorage.setItem('favourites', JSON.stringify(newFavourites)).then(() => {
            eventEmitter.emit('favourites-updated', newFavourites);
            return newFavourites;
        });
    }

    static addEventListener(eventName, handler) {
        return eventEmitter.addListener(eventName, handler);
    }
}

export function useFavourites() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        Settings.getFavourites().then((newFavourites) => setFavourites(newFavourites));
    }, []);

    useEffect(() => {
        const subscription = Settings.addEventListener('favourites-updated', (newFavourites) =>
            setFavourites(newFavourites)
        );
        return () => subscription.remove();
    }, []);

    return favourites;
}

export function useIsFavourite(id) {
    const favourites = useFavourites();
    return !!favourites.find((elem) => elem === id);
}

export function useIsFavouriteWithToggle(id) {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        Settings.getFavourites().then((newFavourites) => setFavourites(newFavourites));
    }, []);

    useEffect(() => {
        const subscription = Settings.addEventListener('favourites-updated', (newFavourites) =>
            setFavourites(newFavourites)
        );
        return () => subscription.remove();
    }, []);

    const isFavourite = !!favourites.find((elem) => elem === id);
    const toggleFavourite = () => {
        if (isFavourite) {
            const newFavourites = favourites.filter((elem) => elem !== id);
            setFavourites(newFavourites);
            Settings.setFavourites(newFavourites);
        } else {
            const newFavourites = [id, ...favourites];
            setFavourites(newFavourites);
            Settings.setFavourites(newFavourites);
        }
    };
    return [isFavourite, toggleFavourite];
}
