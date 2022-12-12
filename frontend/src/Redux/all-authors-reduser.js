const SET_ALL_AUTHORS = 'SET_ALL_AUTHORS'
const SET_CURRENT_PAGE = 'SET-CURRENT-PAGE'
const SET_AUTHORS_TOTAL_COUNT = 'SET_AUTHORS_TOTAL_COUNT'

let initialState = {
    authors: [],
    pageSize: 20,
    totalAuthors: 0,
    currentPage: 1
};

const allAuthorsReduser = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_AUTHORS:
            return {...state, authors: action.authors};
        case SET_CURRENT_PAGE:
            return {...state, currentPage: action.currentPage}
        case SET_AUTHORS_TOTAL_COUNT:
            return {...state, totalAuthors: action.count}
    }
    return state;
}

export const setAllAuthors = (authors) => ({type: SET_ALL_AUTHORS,authors})
export const setCurrentPage = (currentPage) => ({type: SET_CURRENT_PAGE, currentPage})
export const setAuthorsTotalCount = (totalAuthors) => ({type: SET_AUTHORS_TOTAL_COUNT, count: totalAuthors})

export default allAuthorsReduser;