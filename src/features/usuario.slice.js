import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usuarios: []
};

export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers: {
        guardarUsuarios: (state, action) => {
            state.usuarios = Array.isArray(action.payload) ? action.payload : [];
        },
        actualizarPlan: (state, action) => {
            const payload = action.payload;
            if (!payload) return;

            if (!Array.isArray(state.usuarios)) state.usuarios = [];

            const idx = state.usuarios.findIndex(u =>
                (u.id && payload.id && u.id === payload.id) ||
                (u._id && payload._id && String(u._id) === String(payload._id))
            );

            if (idx !== -1) {
                state.usuarios[idx] = {
                    ...state.usuarios[idx],
                    ...payload,
                    plan: payload.plan
                };
            } else {
                state.usuarios.push(payload);
            }
        }
    }
});

export const { guardarUsuarios, actualizarPlan } = usuarioSlice.actions;
export default usuarioSlice.reducer;