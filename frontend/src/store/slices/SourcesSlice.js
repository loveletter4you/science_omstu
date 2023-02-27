import {createSlice} from "@reduxjs/toolkit";



const initialState = {
    sources: [{
        name: null,
        source_type: {
            id: null,
            name: null
        }
    }],
    pageSize: 30,
    count: 1,

};

const SourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {
        setSource(state, action) {
            const {sources, count} = action.payload;
            state.sources = sources;
            state.count = count;
        },
        setSize(state, action) {
            state.pageSize = action.payload;
        }
    }
})
export const {setSource, setSize} = SourcesSlice.actions;
export default SourcesSlice.reducer;