import { configureStore } from '@reduxjs/toolkit'
import allAuthorsReducer from "./slices/AuthorsSlice";
import authorReducer from "./slices/AuthorSlice";
import sortReducer from "./slices/SortSlice";
import publicationsSlice from "./slices/PublicationsSlice";
import onePublicSlice from "./slices/PublicationSlice";
import SourseSlise from "./slices/SourseSlise";
import SoursesSlise from "./slices/SoursesSlise";


const store = configureStore({
    reducer: {
        authors: allAuthorsReducer,
        author: authorReducer,
        sort: sortReducer,
        publications: publicationsSlice,
        publication: onePublicSlice,
        source: SourseSlise,
        sources: SoursesSlise
    }
})



export default store;

