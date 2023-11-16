export const romaneioSelector = (state) => {
	console.log(state.romaneios.cargas);
	return state.romaneios.cargas;
};

export const romaneiosFarmSelector = (state) => state.romaneios.romaneiosFarm;
