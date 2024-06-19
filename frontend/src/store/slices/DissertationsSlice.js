import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {DissertationsAPI} from "../api";

export const fetchDissertations = createAsyncThunk(
    "dissertations/fetchDissertations", async ({page, pageSize}, {rejectWithValue}) => {
        try {
            const res = await DissertationsAPI.getDissertations(page, pageSize)
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });
export const fetchDissertationsSearch = createAsyncThunk(
    "dissertations/fetchDissertationsSearch", async ({search,author_id, from_date, to_date,
                                             page, pageSize}, {rejectWithValue}) => {
        try {
            const res = await DissertationsAPI.getDissertationsSearch(search,author_id, from_date, to_date,
                page, pageSize)
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });


const initialState = {
    dissertations: [{
        title: null,
        registration_number: null,
        dissertation_keywords: [],
        dissertation_date: null,
        author: {
            id: 0,
            name: null,
            surname: null,
            patronymic: null,
        }
    }],
    pageSize: 20,
    count: 1,
    currentPage: 1,
    isFetching: false,
    data:[]
};

const dissertationsSlice = createSlice({
    name: 'dissertations',
    initialState,
    reducers: {
        setSize(state, action) {
            state.pageSize = action.payload;
        },
        setData(state, action) {
            const {dissertations, count} = action.payload;
            state.dissertations = dissertations;
            state.count = count;
        },
        setFilter(state, action){
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDissertations.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchDissertationsSearch.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchDissertations.fulfilled, (state, action) => {
                state.isFetching = false;
                const {dissertations, count} = action.payload;
                state.dissertations = dissertations;
                state.count = count;
            })
            .addCase(fetchDissertationsSearch.fulfilled, (state, action) => {
                state.isFetching = false;
                const {dissertations, count} = action.payload;
                state.dissertations = dissertations;
                state.count = count;

            })

            .addCase(initialState, (state) => {
                state.isFetching = false;
            })
    },
});


export const {setData, setSize, setFilter} = dissertationsSlice.actions;

export default dissertationsSlice.reducer;



