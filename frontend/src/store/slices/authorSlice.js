import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    id: null,
    name: null,
    surname: null,
    patronymic: null
};

const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthor(state, action) {
            state = action.payload.author;
        },
    }
});

export const {setAuthor} = authorSlice.actions;

export default authorSlice;