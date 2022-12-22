import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


const fetchPublications = createAsyncThunk(
    'publications/fetchPublications',
    async (userId, thunkAPI) => {
        const {data} = await axios.get(`/api/publications?page=0&limit=20`);
        return data;
    }
)

const initialState = {
    publications: [],
    pageSize: 20,
    total_publications: 1070,
    currentPage: 1
};

const publicationsSlice = createSlice({
    name: 'publications',
    initialState,
    reducers: {
        setData(state, action) {
            const {publications, total_publications} = action.payload;
            state.publications = publications;
            state.total_publications = total_publications;
        },
    }
});


export const {setData} = publicationsSlice.actions;

export default publicationsSlice.reducer;



