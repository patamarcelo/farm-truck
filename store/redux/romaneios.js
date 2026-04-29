import { createSlice } from "@reduxjs/toolkit";
// import data from "../../utils/dummy-data";

const initialState = {
	user: null,
	projetosCadastrados: [],
	cargas: [],
	romaneiosFarm: [],
	userCustomAttr: null,
	plantioDataFromServer: {},
	mapDataPlot: [],
	ciclo: null,
	userHydrated: false,
};


const RomaneioSlice = createSlice({
	name: "romaneios",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setUserAttr: (state, action) => {
			state.userCustomAttr = action.payload
		},
		setProjetos: (state, action) => {
			state.projetosCadastrados = action.payload;
		},
		addRomaneio: (state, action) => {
			state.cargas.push(action.payload);
		},
		resetData: (state) => {
			state.cargas = [];
		},
		removeFromCargas: (state, action) => {
			state.cargas = state.cargas.filter(
				(data) => data.idApp !== action.payload
			);
		},
		setRomaneiosFarm: (state, action) => {
			state.romaneiosFarm = action.payload;
		},
		removeFavorite: (state, action) => {
			state.romaneios.splice(state.ids.indexOf(action.payload.id), 1);
		},
		setPlantioDataFromServer: (state, action) => {
			state.plantioDataFromServer = action.payload;
		},
		setCurrentCiclo: (state, action) => {
			state.ciclo = action.payload;
		},
		// Add this action to reset all state
		resetState: (state) => {
			Object.assign(state, {
				...initialState,
				cargas: state.cargas, // Preserve cargas data
			});
		},
		setMapPlot: (state, action) => {
			state.mapDataPlot = action.payload;
		},
		setUserHydrated: (state, action) => {
			state.userHydrated = action.payload;
		},

		clearServerSessionData: (state) => {
			state.user = null;
			state.userCustomAttr = null;
			state.projetosCadastrados = [];
			state.romaneiosFarm = [];
			state.plantioDataFromServer = {};
			state.mapDataPlot = [];
			state.ciclo = null;
			state.userHydrated = false;
		},
	}
});

export const addRomaneio = RomaneioSlice.actions.addRomaneio;
export const resetData = RomaneioSlice.actions.resetData;
export const removeFavorite = RomaneioSlice.actions.removeFavorite;
export const addRomaneiosFarm = RomaneioSlice.actions.setRomaneiosFarm;
export const removeFromCargas = RomaneioSlice.actions.removeFromCargas;
export const setUser = RomaneioSlice.actions.setUser;
export const setUserAttr = RomaneioSlice.actions.setUserAttr;
export const setProjetos = RomaneioSlice.actions.setProjetos;
export const setPlantioDataFromServer = RomaneioSlice.actions.setPlantioDataFromServer;
export const setMapPlotData = RomaneioSlice.actions.setMapPlot;
export const setCurrentCiclo = RomaneioSlice.actions.setCurrentCiclo;

export const setUserHydrated = RomaneioSlice.actions.setUserHydrated;

// RESET SLICE
export const resetState = RomaneioSlice.actions.resetState;

export default RomaneioSlice.reducer;