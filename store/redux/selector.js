export const romaneioSelector = (state) => {
	console.log("from State: ", state.romaneios.cargas);
	return state.romaneios.cargas;
};

export const userSelector = (state) => {
	return state.romaneios.user;
};

export const projetosSelector = (state) => {
	return state.romaneios.projetosCadastrados;
};

export const romaneiosFarmSelector = (state) => {
	return state.romaneios.romaneiosFarm;
};
