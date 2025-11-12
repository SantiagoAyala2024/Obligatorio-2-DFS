import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    series: [],
    generos: []
}

const serieSlice = createSlice({
    name: "serie",
    initialState,
    reducers: {
        guardarSerie: (state, action) => {
            if (!action.payload) return;
            if (Array.isArray(action.payload)) {
                state.series.push(...action.payload);
            } else {
                state.series.push(action.payload);
            }
        },
        actualizarSerie: (state, action) => {
            const index = state.series.findIndex(s => s._id === action.payload.serie._id);
            if (index !== -1) {
                state.series[index] = action.payload.serie;
            }
        },
        eliminarSerie: (state, action) => {
            state.series = state.series.filter(s => s._id !== action.payload.serieId);
        },
        guardarSeries: (state, action) => {
            state.series = action.payload;
        },
        guardarGeneros: (state, action) => {
            state.generos = action.payload;
        }
    }
});

export const { guardarSerie, actualizarSerie, eliminarSerie, guardarSeries, guardarGeneros } = serieSlice.actions;
export default serieSlice.reducer;