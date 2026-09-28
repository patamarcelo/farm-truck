import {
    useCallback,
    useEffect,
    useRef
} from "react";

import {
    AppState
} from "react-native";

import AsyncStorage from
    "@react-native-async-storage/async-storage";

import {
    useNetInfo
} from "@react-native-community/netinfo";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    syncColheitaAndMap
} from "./syncColheita";

const STORAGE_KEY = "@colheita:lastSync";
const INTERVAL_MS = 24 * 60 * 60 * 1000;

export function useAutoSyncColheita() {
    const dispatch = useDispatch();
    const netInfo = useNetInfo();

    const syncingRef = useRef(false);

    const plantioData = useSelector(
        (state) =>
            state.romaneios.plantioDataFromServer
    );

    const mapData = useSelector(
        (state) =>
            state.romaneios.mapDataPlot
    );

    const hasPlantioData = Boolean(
        plantioData?.dados &&
        Object.keys(plantioData.dados).length > 0
    );

    const hasMapData =
        Array.isArray(mapData)
            ? mapData.length > 0
            : Boolean(
                mapData &&
                typeof mapData === "object" &&
                Object.keys(mapData).length > 0
            );

    const maybeSync = useCallback(async () => {
        const isOnline =
            netInfo.isConnected === true &&
            netInfo.isInternetReachable !== false;

        if (syncingRef.current || !isOnline) {
            return;
        }

        try {
            const now = Date.now();

            const lastStr =
                await AsyncStorage.getItem(STORAGE_KEY);

            const last = lastStr
                ? Number(lastStr)
                : 0;

            const cacheIsComplete =
                hasPlantioData &&
                hasMapData;

            if (
                cacheIsComplete &&
                last &&
                now - last < INTERVAL_MS
            ) {
                return;
            }

            syncingRef.current = true;

            const succeeded =
                await syncColheitaAndMap(dispatch);

            if (succeeded) {
                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    String(now)
                );
            }
        } catch (error) {
            console.log(
                "[colheita] erro:",
                error?.message
            );
        } finally {
            syncingRef.current = false;
        }
    }, [
        dispatch,
        hasMapData,
        hasPlantioData,
        netInfo.isConnected,
        netInfo.isInternetReachable
    ]);

    useEffect(() => {
        maybeSync();

        const interval = setInterval(
            maybeSync,
            60 * 60 * 1000
        );

        const subscription =
            AppState.addEventListener(
                "change",
                (nextState) => {
                    if (nextState === "active") {
                        maybeSync();
                    }
                }
            );

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, [maybeSync]);
}