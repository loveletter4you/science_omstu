import { configureStore } from '@reduxjs/toolkit'
import allAuthorsReducer from "./slices/allAuthorsSlice";
import authorReducer from "./slices/authorSlice";
import sortReducer from "./slices/sortSlice";
import publicationsSlice from "./slices/publicationsSlice";
import onePublicSlice from "./slices/onePublicSlice";


const store = configureStore({
    reducer: {
        allAuthors: allAuthorsReducer,
        author: authorReducer,
        sort: sortReducer,
        publications: publicationsSlice,
        onePublic: onePublicSlice
    }
})



export default store;

