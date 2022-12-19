import { configureStore } from '@reduxjs/toolkit'
import allAuthorsSlice from "./slices/allAuthorsSlice";
import authorSlice from "./slices/authorSlice";
import {sortSlice} from "./slices/sortSlice";
import AllAuthors from "../Components/AllAuthors/AllAuthors";


const store = configureStore({
    reducer: {
        allAuthors: allAuthorsSlice,
        author: authorSlice,
        sort: sortSlice
    },
})

// console.log('store', store);

export default store;