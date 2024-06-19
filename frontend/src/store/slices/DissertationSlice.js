import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DissertationAPI} from "../api";

export const fetchDissertation = createAsyncThunk(
    "dissertation/fetchDissertation", async (id, {rejectWithValue}) => {
        try {
            const res = await DissertationAPI.getDissertation(id);
            return res.data;
        } catch (err) {
            return rejectWithValue([], err);
        }
    });

const initialState = {
    id: null,
    title: null,
    registration_number: null,
    dissertation_date: null,
    author: {},
    chairman_dissertation_council: {},
    dissertation_keywords: [],
    rosrid_id: null,
    abstract: null,
    protection_date: null,
    dissertation_type: null,
    dissertation_report_type: null,
    tables_count: null,
    pictures_count: null,
    applications_count: null,
    pages_count: null,
    sources_count: null,
    books_count: null,
    bibliography: null,
    organization_supervisor: {},
    author_organization: {},
    protection_organization: {},
    dissertation_subject: [],
    dissertation_supervisors: [],
    dissertation_opponents: [],
    accepted: false,
    isFetching: false
};

const dissertationSlice = createSlice({
    name: 'dissertation',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchDissertation.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchDissertation.fulfilled, (state, action) => {
                state.isFetching = false;
                const {
                    id, title, registration_number, dissertation_date,
                    author, chairman_dissertation_council,
                    dissertation_keywords, rosrid_id,
                    abstract, protection_date,
                    dissertation_type, dissertation_report_type,
                    tables_count, pictures_count,
                    applications_count, pages_count,
                    sources_count, books_count,
                    bibliography, organization_supervisor,
                    author_organization, protection_organization,
                    dissertation_subject, dissertation_supervisors,
                    dissertation_opponents
                } = action.payload.dissertation;
                state.id = id;
                state.title = title;
                state.registration_number = registration_number;
                state.dissertation_date = dissertation_date;
                state.author = author;
                state.chairman_dissertation_council = chairman_dissertation_council;
                state.dissertation_keywords = dissertation_keywords;
                state.rosrid_id = rosrid_id;
                state.abstract = abstract;
                state.protection_date = protection_date;
                state.dissertation_type = dissertation_type;
                state.dissertation_report_type = dissertation_report_type;
                state.tables_count = tables_count;
                state.pictures_count = pictures_count;
                state.applications_count = applications_count;
                state.pages_count = pages_count;
                state.sources_count = sources_count;
                state.books_count = books_count;
                state.bibliography = bibliography;
                state.organization_supervisor = organization_supervisor;
                state.author_organization = author_organization;
                state.protection_organization = protection_organization;
                state.dissertation_subject = dissertation_subject;
                state.dissertation_supervisors = dissertation_supervisors;
                state.dissertation_opponents = dissertation_opponents;


            })
            .addCase(initialState, (state) => {
                state.isFetching = false;
            })
    },

});

export default dissertationSlice.reducer;
