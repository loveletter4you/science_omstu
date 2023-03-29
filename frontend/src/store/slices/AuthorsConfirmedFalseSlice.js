import {AuthorsAPI} from "../../Components/api";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

export const fetchAuthorConfirmed = createAsyncThunk(
    "authorsConfirmedFalse/fetchAuthorsConfirmed", async({page, pageSize, confirmed}, {rejectWithValue}) => {
        try{
            const res = await AuthorsAPI.getAuthorConfirmed(page,pageSize,confirmed)
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
    confirmed: true,
    isFetching: false,
};


const authorsConfirmedFalseSlice = createSlice({
    name: 'authorsConfirmedFalse',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuthorConfirmed.pending, (state) =>{
                state.isFetching = true;
            })
            .addCase(fetchAuthorConfirmed.fulfilled, (state, action) =>{
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
