import {createSlice} from "@reduxjs/toolkit";



const initialState = {
    feedbacks: [{
        name: null,
        mail: null,
        message: null,
        date: null,
        solved: false
    }],
    pageSize: 20,
    count: 1,
    currentPage: 1,

};

const feedbackSlice = createSlice({
    name: 'feedbacks',
    initialState,
    reducers: {
        setData(state, action) {
            const {feedbacks, count} = action.payload;
            state.feedbacks = feedbacks;
            state.count = count;
        },
        setSize(state, action) {
            state.pageSize = action.payload;
        }

    }
});


export const {setData,setSize} = feedbackSlice.actions;

export default feedbackSlice.reducer;



