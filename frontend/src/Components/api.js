import axios from "axios";
import {Cookies, useCookies} from "react-cookie";

const instance = axios.create({
    withCredentials: true,
});


export const postSignIn = (data) => {
    return instance.post("/api/user/token", data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const AuthorAPI = {
    getAuthor(id,) {
        return instance.get(`/api/author/${id}`)
    },
    getAuthorPageSize(id, page, pageSize) {
        return instance.get(`/api/author/${id}/publications?page=${page}&limit=${pageSize}`)
    }
}
export const AuthorsAPI = {
    getAuthorsSearch(search, page, pageSize) {
        return instance.get(`/api/author?search=${search}&page=${page}&limit=${pageSize}`)
    },
    getAuthors(page, pageSize) {
        return instance.get(`/api/author?page=${page}&limit=${pageSize}`)
    }
}

export const FeedbackAPI = {

    getFeedback(page, pageSize, header) {
        return instance.get(`/api/admin/feedbacks?page=${page}&limit=${pageSize}`, {
            headers: {
                authorization : `Bearer ${header}`
            }
        })
    }
}

export const PublicationAPI = {
    getPublication(id) {
        return instance.get(`/api/publication/${id}`)
    }
}

export const PublicationsAPI = {
    getPublicationsSearch(search, page, pageSize) {
        return instance.get(`/api/publication?search=${search}&page=${page}&limit=${pageSize}`)
    },
    getPublications(page, pageSize) {
        return instance.get(`/api/publication?page=${page}&limit=${pageSize}`)
    }
}

export const SourceAPI = {
    getSource(id) {
        return instance.get(`/api/source/${id}`)
    },
    getSourcePageSize(id, page = 0, pageSize, header) {
        return instance.get(`/api/source/${id}/publications?page=${page}&limit=${pageSize}`)
    }
}

export const SourcesAPI = {
    getSourcesSearch(search, page, pageSize) {
        return instance.get(`/api/source?search=${search}&page=${page}&limit=${pageSize}`)
    },
    getSources(page, pageSize) {
        return instance.get(`/api/source?page=${page}&limit=${pageSize}`)
    }
}
