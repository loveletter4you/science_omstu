import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isAuth: false,
    login: null,
    email: null,
    userId: null

};


export const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        setUserData(state, action) {
            const {isAuth} = action.payload;
            state.isAuth = isAuth;
        },
    }
})

export const { setUserData } = signInSlice.actions;

export default signInSlice.reducer;


