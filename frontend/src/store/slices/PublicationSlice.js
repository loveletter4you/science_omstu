import { createSlice} from "@reduxjs/toolkit";



const initialState = {
        id: null,
        publication_type: [],
        source: [],
        title: null,
        publication_date: null,
        publication_authors: [{
            author: {},
            author_publication_organizations: [],

        }],
        abstract: null,
        accepted: false,
        keyword_publications: [],
        publication_links: [],

};

const publicationSlice = createSlice({
    name: 'publication',
    initialState,
    reducers: {
        setPublic(state, action) {
            const {
                id, publication_type, source, title, publication_date,
                publication_authors, abstract, accepted, keyword_publications,
                publication_links
            } = action.payload.publication;
            state.id = id;
            state.publication_type = publication_type;
            state.source = source;
            state.title = title;
            state.publication_date = publication_date;
            state.publication_authors = publication_authors;
            state.abstract = abstract;
            state.accepted = accepted;
            state.keyword_publications = keyword_publications;
            state.publication_links = publication_links;
        }
    },
});


export const {setPublic} = publicationSlice.actions;

export default publicationSlice.reducer;
