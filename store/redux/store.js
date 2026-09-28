import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import RomaneioReducer from "./romaneios";
import uiReducer from "./ui";

// Somente os romaneios criados offline sobrevivem ao reinício do app.
const cargasOnlyTransform = createTransform(
  (state) => ({ cargas: state.cargas }),
  (state) => ({ user: null, projetosCadastrados: [], romaneiosFarm: [], userCustomAttr: null, plantioDataFromServer: {}, mapDataPlot: [], ciclo: null, userHydrated: false, cargas: state?.cargas || [] }),
  { whitelist: ["romaneios"] },
);

const reducer = combineReducers({ romaneios: RomaneioReducer, ui: uiReducer });
const persistedReducer = persistReducer({ key: "root", storage: AsyncStorage, whitelist: ["romaneios"], transforms: [cargasOnlyTransform] }, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
