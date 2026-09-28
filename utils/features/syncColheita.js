// src/features/colheita/syncColheita.js
import { EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN } from "@env";
import { setPlantioDataFromServer, setMapPlotData } from "../../store/redux/romaneios";

const PLANTIO_URL = "https://diamante-quality.up.railway.app/diamante/plantio/get_plantio/";
const MAP_URL = "https://diamante-quality.up.railway.app/diamante/plantio/get_map_plot_app_fetch_app/";

async function getPlantioData(dispatch) {
    const response = await fetch(PLANTIO_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Erro na API de Plantio"
        );
    }

    const hasDados =
        result?.dados &&
        typeof result.dados === "object" &&
        Object.keys(result.dados).length > 0;

    if (!hasDados) {
        console.warn(
            "[Plantio] Resposta vazia; cache preservado."
        );

        return false;
    }

    dispatch(setPlantioDataFromServer(result));

    return true;
}


const hasData = (value) => {
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return Boolean(
        value &&
        typeof value === "object" &&
        Object.keys(value).length > 0
    );
};

async function getMapData(dispatch) {
    const response = await fetch(MAP_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || "Erro na API de Mapa"
        );
    }

    if (!hasData(data?.dados)) {
        console.warn(
            "[Mapa] Resposta vazia; cache preservado."
        );

        return false;
    }

    dispatch(setMapPlotData(data.dados));

    return true;
}


export async function syncColheitaAndMap(dispatch) {
    const [plantioOk, mapOk] = await Promise.all([
        getPlantioData(dispatch),
        getMapData(dispatch)
    ]);

    return plantioOk && mapOk;
}