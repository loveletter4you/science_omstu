import {AuthorsAPI} from "../../Components/api";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchAuthorUnconfirmed = createAsyncThunk(
    "authorsConfirmedFalse/fetchAuthorsConfirmed", async({page, pageSize, confirmed}, {rejectWithValue}) => {
        try{
            const res = await AuthorsAPI.getUnconfirmedOmSTU(page,pageSize)
            return res.data;
        } catch (err){
            return rejectWithValue([], err)
        }
    }
);

const initialState = {
    authors: [],
    pageSize: 30,
    count: 1,
    currentPage: 1,
    isFetching: false,
};


const authorsConfirmedFalseSlice = createSlice({
    name: 'authorsConfirmedFalse',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthorUnconfirmed.pending, (state) =>{
                state.isFetching = true;
            })
            .addCase(fetchAuthorUnconfirmed.fulfilled, (state, action) =>{
                state.isFetching = false;
                const {authors, count} = action.payload;
                state.authors = authors;
                state.count = count;
            })
            .addCase(initialState, (state) => {
                state.isFetching = false;
            })
    }
});

export default authorsConfirmedFalseSlice.reducer;
