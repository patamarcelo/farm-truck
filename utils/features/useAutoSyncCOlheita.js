// src/features/colheita/useAutoSyncColheita.js
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { useDispatch } from "react-redux";
import { syncColheitaAndMap } from "./syncColheita";

const STORAGE_KEY = "@colheita:lastSync";
// 1x por dia:
// const INTERVAL_MS = 24 * 60 * 60 * 1000;
// 10 Minutos:
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutos
// se quiser 1x por semana:
// const INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export function useAutoSyncColheita() {
    const netInfo = useNetInfo();
    const dispatch = useDispatch();

    useEffect(() => {
        const maybeSync = async () => {
            if (!netInfo.isConnected) {
                return;
            }

            try {
                const now = Date.now();
                const lastStr = await AsyncStorage.getItem(STORAGE_KEY);
                const last = lastStr ? Number(lastStr) : 0;

                // se ainda não passou o intervalo, não faz nada
                if (last && now - last < INTERVAL_MS) {
                    return;
                }

                console.log("[colheita] iniciando sync automática...");
                await syncColheitaAndMap(dispatch);
                await AsyncStorage.setItem(STORAGE_KEY, String(now));
                console.log("[colheita] sync automática concluída");
            } catch (e) {
                console.log("[colheita] erro na sync automática:", e.message);
            }
        };

        maybeSync();
    }, [netInfo.isConnected, dispatch]);
}
