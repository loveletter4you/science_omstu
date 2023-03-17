import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id: 0,
    name: null,
    surname: null,
    patronymic: null,
    author_identifiers: [],
    author_departments: [],
};

const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthor(state, action) {
            const {id, name, surname, patronymic, author_identifiers, author_departments} = action.payload.author;
            state.id = id;
            state.name = name;
            state.surname = surname;
            state.patronymic = patronymic;
            state.author_identifiers = author_identifiers;
            state.author_departments = author_departments;
        },
    }
});

export const {setAuthor} = authorSlice.actions;

export default authorSlice.reducer;