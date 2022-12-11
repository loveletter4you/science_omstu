const SET_AUTHORS = 'SET_AUTHORS'

let initialState = {
    author: null
};

const authorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHORS:
            return {...state, author: action.author};
    }
    return state;
}

export const setAuthors = (author) => ({type: SET_AUTHORS,author})

export default authorsReducer;