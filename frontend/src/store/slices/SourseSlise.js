import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";



const initialState = {
    source:[]
};

const SourceSlice = createSlice({
    name: 'source',
    initialState,
    reducers: {}
})


export const {} = SourceSlice.actions;
export default SourceSlice.reducer;