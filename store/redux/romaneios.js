import { createSlice } from "@reduxjs/toolkit";
// import data from "../../utils/dummy-data";

const initialState = {
	user: "",
	projetosCadastrados: [],
	cargas: [],
	romaneiosFarm: [],
	userCustomAttr: {},
	plantioDataFromServer: {}
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
		setRomaneiosFarm: (state, action) => {
			state.romaneiosFarm = action.payload;
		},
		removeFavorite: (state, action) => {
			state.romaneios.splice(state.ids.indexOf(action.payload.id), 1);
		},
		setPlantioDataFromServer: (state, action) => {
			state.plantioDataFromServer = action.payload;
		},
		// Add this action to reset all state
		resetState: () => initialState
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

// RESET SLICE
export const resetState = RomaneioSlice.actions.resetState;

export default RomaneioSlice.reducer;
