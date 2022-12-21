import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


const fetchAuthors = createAsyncThunk(
    'authors/fetchAuthorsAll',
    async (userId, thunkAPI) => {
        const {data} = await axios.get(`//localhost/api/authors?page=0&limit=20`);
        return data;
    }
)

const initialState = {
    authors: [],
    pageSize: 20,
    total_authors: 1070,
    currentPage: 1
};

const allAuthorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        setData(state, action) {
            const {authors, total_authors} = action.payload;
            state.authors = authors;
            state.total_authors = total_authors;
        },
    }
});


export const {setData} = allAuthorsSlice.actions;

export default allAuthorsSlice.reducer;



