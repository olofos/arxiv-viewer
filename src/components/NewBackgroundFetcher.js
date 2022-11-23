import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Arxiv from '../util/Arxiv';
import { useConfig } from '../util/Settings';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function sendNewNotification({ category, date, ...data }) {
    const d = new Date(date);
    await Notifications.scheduleNotificationAsync({
        identifier: category,
        content: {
            title: `New papers from ${category}`,
            body: `Published ${d.toDateString()}}\n${data.new.length} new papers\n${
                data.crossListed.length
            } cross listed papers\n${data.updated.length} updated papers`,
            data: { category, type: 'new-papers' },
            badge: data.new.length,
            sound: null,
        },
        trigger: { seconds: 1 },
    });
}

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        const config = await AsyncStorage.getItem('config').then((conf) =>
            conf ? JSON.parse(conf) : { defaultCategory: 'none' }
        );

        const category = config?.defaultCategory || 'none';

        if (category === 'none') {
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        const lastFetch = await AsyncStorage.getItem(`fetch-new-${category}`).then(
            (d) => new Date(d || 0)
        );

        const fetchDay = lastFetch.getDay();
        const weekend = fetchDay === 5 ? 2 * 48 : 0;

        const now = new Date(Date.now());

        if (now - lastFetch < (weekend + 23) * 60 * 60 * 1000) {
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        const result = await Arxiv.fetchNew(category);

        const newDate = new Date(result.date);
        if (newDate <= lastFetch) {
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        await sendNewNotification(result);

        await AsyncStorage.setItem(`fetch-new-${category}`, new Date(result.date).toISOString());

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (e) {
        console.error(e);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

async function registerBackgroundFetchAsync() {
    console.log('Registering background fetch task');
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15,
        stopOnTerminate: false,
        startOnBoot: true,
    });
}

async function unregisterBackgroundFetchAsync() {
    console.log('Unregistering background fetch task');
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function NewBackgroundFetcher() {
    const navigation = useNavigation();

    const responseListener = useRef();

    const sendNotifications = useConfig('newPapersNotification');

    useEffect(() => {
        if (sendNotifications) {
            registerBackgroundFetchAsync();
        } else {
            unregisterBackgroundFetchAsync();
        }
    }, [sendNotifications]);

    useEffect(() => {
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const { data } = response.notification.request.content;
                if (data.type === 'new-papers') {
                    navigation.navigate('NewListScreen', data);
                }
            }
        );

        return () => {
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [navigation]);
    return null;
}
