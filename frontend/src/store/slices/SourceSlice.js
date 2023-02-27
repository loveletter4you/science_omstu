import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";



const initialState = {
        id: null,
        name: null,
        source_type: {
            id: null,
            name: null
        },
        source_ratings: [{
            source_rating_type:{
                id: null,
                name: null
            },
            rating: null,
            rating_date: null
        }],
        source_links: [{
            source_link_type: {
                id: null,
                name: null
            },
            link: null
        }],

};
const SourceSlice = createSlice({
    name: 'source',
    initialState,
    reducers: {
        setSource(state, action){
            const {id, name, source_type, source_ratings, source_links } = action.payload.source;
            state.id = id;
            state.name = name;
            state.source_type = source_type;
            state.source_ratings = source_ratings;
            state.source_links = source_links;
        }
    }
})


export const {setSource} = SourceSlice.actions;
export default SourceSlice.reducer;