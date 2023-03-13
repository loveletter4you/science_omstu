import {configureStore} from '@reduxjs/toolkit'
import allAuthorsReducer from "./slices/AuthorsSlice";
import authorReducer from "./slices/AuthorSlice";
import sortReducer from "./slices/SortSlice";
import publicationsSlice from "./slices/PublicationsSlice";
import publicationSlice from "./slices/PublicationSlice";
import SourceSlice from "./slices/SourceSlice";
import SourcesSlice from "./slices/SourcesSlice";
import signInSlice from "./slices/SignInSlice";
import feedbackSlice from "./slices/FeedbackSlice";

const store = configureStore({
    reducer: {
        authors: allAuthorsReducer,
        author: authorReducer,
        sort: sortReducer,
        publications: publicationsSlice,
        publication: publicationSlice,
        source: SourceSlice,
        sources: SourcesSlice,
        signIn: signInSlice,
        feedbacks: feedbackSlice
    }
})
export default store;

