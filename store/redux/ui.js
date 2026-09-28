import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { syncingRomaneioId: null },
  reducers: {
    startRomaneioSync: (state, action) => { state.syncingRomaneioId = action.payload; },
    finishRomaneioSync: (state) => { state.syncingRomaneioId = null; },
  },
});

export const { startRomaneioSync, finishRomaneioSync } = uiSlice.actions;
export default uiSlice.reducer;
