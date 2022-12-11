import {combineReducers, legacy_createStore as createStore} from "redux";
import authorsReducer from './authors-reducer'
import allAuthorsReduser from "./all-authors-reduser";

let reducers = combineReducers({
    authorsPage: authorsReducer,
    allAuthorsPage: allAuthorsReduser
});

let store = createStore(reducers);

export default store;