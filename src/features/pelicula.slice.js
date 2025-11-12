import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    peliculas: [],
    generos: []
}

const peliculaSlice = createSlice({
    name: "pelicula",
    initialState,
    reducers: {
        guardarPelicula: (state, action) => {
            if (!action.payload) return;
            if (Array.isArray(action.payload)) {
                state.peliculas.push(...action.payload);
            } else {
                state.peliculas.push(action.payload);
            }
        },
        actualizarPelicula: (state, action) => {
            const index = state.peliculas.findIndex(p => p._id === action.payload.pelicula._id);
            if (index !== -1) {
                state.peliculas[index] = action.payload.pelicula;
            }
        },
        eliminarPelicula: (state, action) => {
            state.peliculas = state.peliculas.filter(p => p._id !== action.payload.peliculaId);
        },
        guardarPeliculas: (state, action) => {
            state.peliculas = action.payload;
        },
        guardarGeneros: (state, action) => {
            state.generos = action.payload;
        }
    }
});

export const { guardarPelicula, actualizarPelicula, eliminarPelicula, guardarPeliculas, guardarGeneros } = peliculaSlice.actions;
export default peliculaSlice.reducer;