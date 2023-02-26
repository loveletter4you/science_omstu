import {createSlice} from "@reduxjs/toolkit";

const initialState = {
        id: null,
        name: null,
        surname: null,
        patronymic: null,
        author_identifiers: [],
};

const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthor(state, action) {
            const {id, name, surname, patronymic, author_identifiers} = action.payload.author;
            state.id = id;
            state.name = name;
            state.surname = surname;
            state.patronymic = patronymic;
            state.author_identifiers = author_identifiers;
        },
    }
});

export const {setAuthor} = authorSlice.actions;

export default authorSlice.reducer;