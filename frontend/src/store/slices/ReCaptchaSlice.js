import { createSlice } from '@reduxjs/toolkit'


const initialState = {
        feedback: {
            name: null,
            mail: null,
            message: null
        },
        token: null
};


export const CaptchaSlice = createSlice({
    name: 'captcha',
    initialState,
    reducers: {
        setCaptcha(state, action) {
            const {feedback, token} = action.payload;
            state.feedback = feedback;
            state.token = token;
        },
    }
})

export const { setCaptcha } = CaptchaSlice.actions;

export default CaptchaSlice.reducer;

