import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    publicationType: [],
    sourceRatingTypes: [],
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
        }
    }
});


export const {getPublicationType, getSourceRatingTypes} = filterSlices.actions;

export default filterSlices.reducer;
