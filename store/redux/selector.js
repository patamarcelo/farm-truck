export const romaneioSelector = (state) => {
	return state.romaneios.cargas;
};

export const userSelector = (state) => {
	return state.romaneios.user;
};

export const userSelectorAttr = (state) => {
	return state.romaneios.userCustomAttr;
};

export const projetosSelector = (state) => {
	return state.romaneios.projetosCadastrados;
};

export const romaneiosFarmSelector = (state) => {
	return state.romaneios.romaneiosFarm;
};

export const plantioDataFromServerSelector = (state) => {
	return state.romaneios.plantioDataFromServer;
};
