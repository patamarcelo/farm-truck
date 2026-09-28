import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	projetosCadastrados: [],
	cargas: [],
	romaneiosFarm: [],
	userCustomAttr: null,
	plantioDataFromServer: {},
	mapDataPlot: [],
	ciclo: null,
	userHydrated: false
};

const asIso = (value) => (value instanceof Date ? value.toISOString() : value);
const normalizeCarga = (item) => ({
	...item,
	appDate: asIso(item.appDate),
	createdAt: asIso(item.createdAt),
	entrada: asIso(item.entrada),
	syncDate: asIso(item.syncDate)
});

const slice = createSlice({
	name: "romaneios",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setUserAttr: (state, action) => {
			state.userCustomAttr = action.payload;
		},
		setProjetos: (state, action) => {
			state.projetosCadastrados = action.payload || [];
		},
		addRomaneio: (state, action) => {
			state.cargas.unshift(normalizeCarga(action.payload));
		},
		resetData: (state) => {
			state.cargas = [];
		},
		removeFromCargas: (state, action) => {
			state.cargas = state.cargas.filter(
				(item) => item.idApp !== action.payload
			);
		},
		setRomaneiosFarm: (state, action) => {
			state.romaneiosFarm = action.payload || [];
		},
		setPlantioDataFromServer: (state, action) => {
			state.plantioDataFromServer = action.payload || {};
		},
		setCurrentCiclo: (state, action) => {
			state.ciclo = action.payload;
		},
		setMapPlot: (state, action) => {
			state.mapDataPlot = action.payload || [];
		},
		setUserHydrated: (state, action) => {
			state.userHydrated = Boolean(action.payload);
		},
		resetState: (state) =>
			Object.assign(state, { ...initialState, cargas: state.cargas }),
		clearServerSessionData: (state) =>
			Object.assign(state, {
				...state,
				user: null,
				userCustomAttr: null,
				projetosCadastrados: [],
				romaneiosFarm: [],
				plantioDataFromServer: {},
				mapDataPlot: [],
				ciclo: null,
				userHydrated: false
			})
	}
});

export const {
	addRomaneio,
	resetData,
	removeFromCargas,
	setUser,
	setUserAttr,
	setProjetos,
	setPlantioDataFromServer,
	setCurrentCiclo,
	setMapPlot: setMapPlotData,
	setUserHydrated,
	resetState,
	clearServerSessionData
} = slice.actions;
export const addRomaneiosFarm = slice.actions.setRomaneiosFarm;
export default slice.reducer;
