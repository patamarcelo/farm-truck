import { createSlice } from "@reduxjs/toolkit";
import data from "../../utils/dummy-data";

const initialState = {
	cargas: data
};
const RomaneioSlice = createSlice({
	name: "romaneios",
	initialState,
	reducers: {
		addRomaneio: (state, action) => {
			state.cargas.push(action.payload);
		},
		resetData: (state) => {
			state.cargas = data;
		},
		removeFavorite: (state, action) => {
			state.romaneios.splice(state.ids.indexOf(action.payload.id), 1);
		}
	}
});

export const addRomaneio = RomaneioSlice.actions.addRomaneio;
export const resetData = RomaneioSlice.actions.resetData;
export const removeFavorite = RomaneioSlice.actions.removeFavorite;

export default RomaneioSlice.reducer;
