import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RidAPI} from "../api";

export const fetchRid = createAsyncThunk(
    "rid/fetchRid", async (id, {rejectWithValue}) => {
        try {
            const res = await RidAPI.getRid(id);
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });

const initialState = {
    id: null,
    title: null,
    registration_number: null,
    rid_date: null,
    work_supervisor: {},
    keyword_rids: [],
    rosrid_id: null,
    abstract: null,
    rid_type: null,
    expected: null,
    using_ways: null,
    number_of_prototypes: null,
    organization_supervisor: {},
    customer: {},
    rid_subject: [],
    rid_authors: [],
    organization_executor: [],
    accepted: false,
    isFetching: false
};

const ridSlice = createSlice({
    name: 'rid',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchRid.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchRid.fulfilled, (state, action) => {
                state.isFetching = false;
                const {
                    id, title, registration_number, rid_date,
                    work_supervisor, keyword_rids,
                    rosrid_id, abstract,
                    rid_type, expected,
                    using_ways, number_of_prototypes,
                    organization_supervisor,
                    customer, rid_subject,
                    rid_authors, organization_executor
                } = action.payload.rid;
                state.id = id;
                state.title = title;
                state.registration_number = registration_number;
                state.rid_date = rid_date;
                state.work_supervisor = work_supervisor;
                state.keyword_rids = keyword_rids;
                state.rosrid_id = rosrid_id;
                state.abstract = abstract;
                state.rid_type = rid_type;
                state.expected = expected;
                state.using_ways = using_ways;
                state.number_of_prototypes = number_of_prototypes;
                state.organization_supervisor = organization_supervisor;
                state.customer = customer;
                state.rid_subject = rid_subject;
                state.rid_authors = rid_authors;
                state.organization_executor = organization_executor;


            })
            .addCase(initialState, (state) => {
                state.isFetching = false;
            })
    },

});

export default ridSlice.reducer;
