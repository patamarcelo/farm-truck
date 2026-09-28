import {
  configureStore,
  combineReducers
} from "@reduxjs/toolkit";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  persistReducer,
  persistStore,
  createTransform
} from "redux-persist";

import RomaneioReducer from "./romaneios";
import uiReducer from "./ui";

const serializeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid || null,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null
  };
};

const romaneiosCacheTransform = createTransform(
  (state) => ({
    user: serializeUser(state.user),

    cargas: state.cargas || [],

    romaneiosFarm: state.romaneiosFarm || [],

    projetosCadastrados:
      state.projetosCadastrados || [],
    plantioDataFromServer:
      state.plantioDataFromServer || {},
    mapDataPlot: state.mapDataPlot || [],
    ciclo: state.ciclo || null
  }),

  (state) => ({
    user: state?.user || null,
    userCustomAttr: null,
    userHydrated: false,

    cargas: state?.cargas || [],
    projetosCadastrados:
      state?.projetosCadastrados || [],
    plantioDataFromServer:
      state?.plantioDataFromServer || {},
    mapDataPlot: state?.mapDataPlot || [],
    ciclo: state?.ciclo || null,

    romaneiosFarm:
      state?.romaneiosFarm || [],
  }),

  {
    whitelist: ["romaneios"]
  }
);

const reducer = combineReducers({
  romaneios: RomaneioReducer,
  ui: uiReducer
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["romaneios"],
    transforms: [romaneiosCacheTransform]
  },
  reducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);