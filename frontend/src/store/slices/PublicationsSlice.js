import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {PublicationsAPI} from "../../Components/api";

export const fetchPublications = createAsyncThunk(
    "publications/fetchPublications", async ({page, pageSize}, {rejectWithValue}) => {
        try {
            const res = await PublicationsAPI.getPublications(page, pageSize)
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });
export const fetchPublicationsSearch = createAsyncThunk(
    "publications/fetchPublicationsSearch", async ({search, page, pageSize}, {rejectWithValue}) => {
        try {
            const res = await PublicationsAPI.getPublicationsSearch(search, page, pageSize)
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });


const initialState = {
    publications: [{
        publication_type: {
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
    isFetching: false,
};

const publicationsSlice = createSlice({
    name: 'publications',
    initialState,
    reducers: {
        setSize(state, action) {
            state.pageSize = action.payload;
        },
        setData(state, action) {
            const {publications, count} = action.payload;
            state.publications = publications;
            state.count = count;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublications.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchPublicationsSearch.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchPublications.fulfilled, (state, action) => {
                state.isFetching = false;
                const {publications, count} = action.payload;
                state.publications = publications;
                state.count = count;
            })
            .addCase(fetchPublicationsSearch.fulfilled, (state, action) => {
                state.isFetching = false;
                const {publications, count} = action.payload;
                state.publications = publications;
                state.count = count;
            })

            .addCase(initialState, (state) => {
                state.isFetching = false;
            })
    },
});


export const {setData, setSize} = publicationsSlice.actions;

export default publicationsSlice.reducer;



