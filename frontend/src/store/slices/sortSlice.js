import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    popupValue: 'популярности',
};


export const sortSlice = createSlice({
    name: 'sort',
    initialState,
    reducers: {
        setPopupValue(state, action) {
            state.popupValue = action.payload;
        }
    },
})

export const { setPopupValue } = sortSlice.actions;

export default sortSlice.reducer;


