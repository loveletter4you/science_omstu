import {createSlice} from "@reduxjs/toolkit";



const initialState = {
    sources: [],
    pageSize: 30,
    total_source: 1
};

const SourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {}
})
export const {} = SourcesSlice.actions;
export default SourcesSlice.reducer;