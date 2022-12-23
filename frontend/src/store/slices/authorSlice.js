import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id: null,
    name: null,
    surname: null,
    patronymic: null,
    identifiers: [],
    publications: []

};

const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthor(state, action) {
            const {id, name, surname, patronymic} = action.payload.author;
            const identifiers = action.payload.identifiers;
            state.id = id;
            state.name = name;
            state.surname = surname;
            state.patronymic = patronymic;
            state.identifiers = identifiers;
        },
        setPublic(state, action) {
            const publications = action.payload.publications;
            state.publications = publications;
        }
    }
});

export const {setAuthor, setPublic} = authorSlice.actions;

export default authorSlice.reducer;