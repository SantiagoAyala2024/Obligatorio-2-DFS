import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categorias: []
};

export const categoriaSlice = createSlice({
    name: "categoria",
    initialState,
    reducers: {
        guardarCategorias: (state, action) => {
            state.categorias = action.payload;
        },
    },
});

export const { guardarCategorias } = categoriaSlice.actions;
export default categoriaSlice.reducer;