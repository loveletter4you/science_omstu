import { createSlice} from "@reduxjs/toolkit";



const initialState = {
    authors: [],
    pageSize: 30,
    total_authors: 1,
    currentPage: 1
};

const authorsSlice = createSlice({
    name: 'authors',
    initialState,
    reducers: {
        setData(state, action) {
            const {authors, total_authors} = action.payload;
            state.authors = authors;
            state.total_authors = total_authors;
        },
        setSize(state, action) {
            state.pageSize = action.payload;
        }

    }
});


export const {setData, setSize} = authorsSlice.actions;

export default authorsSlice.reducer;



