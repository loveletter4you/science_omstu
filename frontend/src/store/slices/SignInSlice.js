import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    username: null,
    password: null,
    isAuth: false

};

export const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        setIsAuth(state, action) {
            state.isAuth = action.payload;
        },
        setUserData(state,action) {
            const {username, password} = action.payload;
            state.username = username;
            state.password = password;
        }
    }
})

export const { setUserData, setIsAuth } = signInSlice.actions;

export default signInSlice.reducer;


