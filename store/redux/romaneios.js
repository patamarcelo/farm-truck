import { createSlice } from "@reduxjs/toolkit";
import data from "../../utils/dummy-data";

const initialState = {
	cargas: data,
	romaneiosFarm: []
};
const RomaneioSlice = createSlice({
	name: "romaneios",
	initialState,
	reducers: {
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
		}
	}
});

export const addRomaneio = RomaneioSlice.actions.addRomaneio;
export const resetData = RomaneioSlice.actions.resetData;
export const removeFavorite = RomaneioSlice.actions.removeFavorite;
export const addRomaneiosFarm = RomaneioSlice.actions.setRomaneiosFarm;
export const removeFromCargas = RomaneioSlice.actions.removeFromCargas;

export default RomaneioSlice.reducer;
