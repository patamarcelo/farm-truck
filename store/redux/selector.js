import { createSelector } from "@reduxjs/toolkit";
import { getRomaneioStatus, matchesRomaneio, toDate } from "../../utils/romaneio";

export const romaneioSelector = (state) => state.romaneios.cargas;
export const userSelector = (state) => state.romaneios.user;
export const userSelectorAttr = (state) => state.romaneios.userCustomAttr;
export const projetosSelector = (state) => state.romaneios.projetosCadastrados;
export const romaneiosFarmSelector = (state) => state.romaneios.romaneiosFarm;
export const plantioDataFromServerSelector = (state) => state.romaneios.plantioDataFromServer;
export const selectMapDataPlot = (state) => state.romaneios.mapDataPlot;
export const selectCurrentCiclo = (state) => state.romaneios.ciclo;
export const selectSyncingRomaneioId = (state) => state.ui.syncingRomaneioId;

export const selectRomaneioCounters = createSelector([romaneiosFarmSelector], (items) => items.reduce((result, item) => {
  const status = getRomaneioStatus(item);
  result[status] = (result[status] || 0) + 1;
  return result;
}, {}));

export const createFilteredRomaneiosSelector = (filters) => createSelector([romaneiosFarmSelector], (items) =>
  items.filter((item) => matchesRomaneio(item, filters)).sort((a, b) => (toDate(b.appDate)?.getTime() || 0) - (toDate(a.appDate)?.getTime() || 0)),
);
