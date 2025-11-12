import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth.slice";
import usuarioReducer from "../features/usuario.slice";
import categoriaReducer from "../features/categoria.slice";
import peliculaReducer from "../features/pelicula.slice";
import serieReducer from "../features/serie.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        usuario: usuarioReducer,
        categoria: categoriaReducer,
        pelicula: peliculaReducer,
        serie: serieReducer,
    },
});