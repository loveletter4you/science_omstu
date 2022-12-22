import { configureStore } from '@reduxjs/toolkit'
import allAuthorsReducer from "./slices/allAuthorsSlice";
import authorReducer from "./slices/authorSlice";
import sortReducer from "./slices/sortSlice";
import publicationsSlice from "./slices/publicationsSlice";


const store = configureStore({
    reducer: {
        allAuthors: allAuthorsReducer,
        author: authorReducer,
        sort: sortReducer,
        publications: publicationsSlice
    },
})



export default store;

