import { configureStore } from '@reduxjs/toolkit'
import allAuthorsReducer from "./slices/AuthorsSlice";
import authorReducer from "./slices/AuthorSlice";
import sortReducer from "./slices/SortSlice";
import publicationsSlice from "./slices/PublicationsSlice";
import publicationSlice from "./slices/PublicationSlice";
import SourceSlice from "./slices/SourseSlise";
import SourcesSlice from "./slices/SoursesSlise";




const store = configureStore({
    reducer: {
        authors: allAuthorsReducer,
        author: authorReducer,
        sort: sortReducer,
        publications: publicationsSlice,
        publication: publicationSlice,
        source: SourceSlice,
        sources: SourcesSlice,

    }
})



export default store;

