import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    authors: [],
    pageSize: 20,
    totalAuthors: 0,
    currentPage: 1
};


const allAuthorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        setAuthors(state, action) {
            state.authors = [...action.payload.authors];
        },
    }
});


export const {setAuthors} = allAuthorsSlice.actions;

export default allAuthorsSlice;



