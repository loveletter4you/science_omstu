const SET_ALL_AUTHORS = 'SET_ALL_AUTHORS'
const SET_CURRENT_PAGE = 'SET-CURRENT-PAGE'
const SET_USERS_TOTAL_COUNT = 'SET-USERS-TOTAL-COUNT'

let initialState = {
    authors: [],
    pageSize: 20,
    totalUsersCount: 1070,
    currentPage: 1
};

const allAuthorsReduser = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_AUTHORS:
            return {...state, authors: action.authors};
        case SET_CURRENT_PAGE:
            return {...state, currentPage: action.currentPage}
        case SET_USERS_TOTAL_COUNT:
            return {...state, totalUsersCount: action.count}
    }
    return state;
}

export const setAllAuthors = (authors) => ({type: SET_ALL_AUTHORS,authors})
export const setCurrentPage = (currentPage) => ({type: SET_CURRENT_PAGE, currentPage})
export const setAuthorsTotalCount = (totalUsersCount) => ({type: SET_USERS_TOTAL_COUNT, count: totalUsersCount})

export default allAuthorsReduser;