import { createSlice} from "@reduxjs/toolkit";



const initialState = {
    authors: [],
    pageSize: 30,
    count: 1,
    currentPage: 1,
};

const authorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        setData(state, action) {
            const {authors, count} = action.payload;
            state.authors = authors;
            state.count = count;
        },
        setSize(state, action) {
            state.pageSize = action.payload;
        }

    }
});


export const {setData, setSize} = authorsSlice.actions;

export default authorsSlice.reducer;



