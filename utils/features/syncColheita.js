// src/features/colheita/syncColheita.js
import { EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN } from "@env";
import { setPlantioDataFromServer, setMapPlotData } from "../../store/redux/romaneios";

const PLANTIO_URL = "https://diamante-quality.up.railway.app/diamante/plantio/get_plantio/";
const MAP_URL = "https://diamante-quality.up.railway.app/diamante/plantio/get_map_plot_app_fetch_app/";

async function getPlantioData(dispatch) {
    console.log("pegando dados do plantio");
    const response = await fetch(PLANTIO_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`,
        },
    });

    const result = await response.json();
    console.log("pegando dados do plantio", result);

    if (response.ok) {
        dispatch(setPlantioDataFromServer(result));
        return true;
    } else {
        throw new Error(result.message || "Erro na API de Plantio");
    }
}

async function getMapData(dispatch) {
    console.log("pegando dados do mapa");
    const response = await fetch(MAP_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${EXPO_PUBLIC_REACT_APP_DJANGO_TOKEN}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log("dados mapa", data);
        dispatch(setMapPlotData(data.dados));
        return true;
    } else {
        throw new Error("Erro na API de Mapa");
    }
}

// 🔥 Função única para usar tanto no Drawer quanto no "backdoor"
export async function syncColheitaAndMap(dispatch) {
    await Promise.all([getPlantioData(dispatch), getMapData(dispatch)]);
}
