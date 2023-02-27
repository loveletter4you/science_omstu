import {createSlice} from "@reduxjs/toolkit";



const initialState = {
    publications: [{
        publication_type:{
            id: 0,
            name: null
        },
        source: {
            id: 0,
            name: null
        },
        title: null,
        publication_date: null,
        publication_authors: []
    }],
    pageSize: 20,
    count: 1,
    currentPage: 1,

};

const publicationsSlice = createSlice({
    name: 'publications',
    initialState,
    reducers: {
        setData(state, action) {
            const {publications, count} = action.payload;
            state.publications = publications;
            state.count = count;
        },
        setSize(state, action) {
            state.pageSize = action.payload;
        }

    }
});


export const {setData,setSize} = publicationsSlice.actions;

export default publicationsSlice.reducer;



