import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    publication_type: {},
    source: {},
    title: null,
    publication_date: null,
    publication_authors: []
};

const AuthorsPublicationsSlice = createSlice({
    name: 'AuthorsPublications',
    initialState,
    reducers: {
        setPublic(state, action) {
            const{publication_type, source, title, publication_date, publication_authors} = action.payload;
            state.publication_type = publication_type;
            state.source = source;
            state.title = title;
            state.publication_date = publication_date;
            state.publication_authors = publication_authors;
        }
    }
});

export const {setPublic} = AuthorsPublicationsSlice.actions;

export default AuthorsPublicationsSlice.reducer;