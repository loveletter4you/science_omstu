import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    publicationType: [],
    sourceRatingTypes: [],
    departments: [],
};

const filterSlices = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        getPublicationType(state, action) {
            state.publicationType = action.payload;
        },
        getSourceRatingTypes(state, action) {
            state.sourceRatingTypes = action.payload;
        },
        getDepartments(state, action) {
            state.departments = action.payload;
        }
    }
});


export const {getPublicationType, getSourceRatingTypes, getDepartments} = filterSlices.actions;

export default filterSlices.reducer;
