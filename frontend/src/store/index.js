import {configureStore} from "@reduxjs/toolkit";
import authorSlice from "./slices/authorSlice";
import allAuthorsSlice from "./slices/allAuthorsSlice";


export const store = configureStore({
    reducer:{
        author: authorSlice,
        allAuthor: allAuthorsSlice
    }
});

