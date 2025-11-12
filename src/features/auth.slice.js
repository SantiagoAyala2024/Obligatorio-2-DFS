import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loguear: (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        },
        desloguear: (state) => {
            state.token = null;
            localStorage.removeItem("token")
        },
    },
});


export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectToken = (state) => state.auth.token;

export const { loguear, desloguear } = authSlice.actions;
export default authSlice.reducer;