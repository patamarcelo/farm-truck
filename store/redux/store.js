import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import RomaneioReducer from "./romaneios";

const reducer = combineReducers({
	romaneios: RomaneioReducer
});
export const store = configureStore({
	reducer
});
