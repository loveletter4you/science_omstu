import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    seeFiltered: 'Популярности',

};


export const sortSlice = createSlice({
    name: 'sort',
    initialState,
    reducers: {
        setValue(state, action) {
            state.seeFiltered = action.payload;
        },
    }
})

export const { setValue } = sortSlice.actions;

export default sortSlice.reducer;


