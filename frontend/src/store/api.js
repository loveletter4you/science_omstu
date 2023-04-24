import axios from "axios";

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

export const postMergeAuthors = (merge_id, base_id, token) =>{
    return instance.post(`/api/author/${merge_id}/merge?base_id=${base_id}`, {merge_id: merge_id, base_id: base_id})
}

export const postAuthorsData = (data) => {
    return instance.post("/api/admin/upload/authors", data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const DataUploadAPI = {
    postAuthorsData(data) {
        return instance.post("/api/admin/upload/authors", data, {
            headers: {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarylMDxS6LSTp97MKcy",
            }
        })
    },
    postScopusData(data) {
        return instance.post("/api/admin/upload/scopus", data)
    },
    postWhiteListData(data) {
        return instance.post("/api/admin/upload/white_list", data)
    },
    postJCRData(data) {
        return instance.post("/api/admin/upload/jcr", data)
    },
}

export const AuthorAPI = {
    getAuthor(id) {
        return instance.get(`/api/author/${id}`)
    },
    getAuthorPublication(id, page, pageSize) {
        return instance.get(`/api/author/${id}/publications?page=${page}&limit=${pageSize}`)
    }
}
export const AuthorsAPI = {
    getAuthorsSearch(search, page, pageSize) {
        return instance.get(`/api/author?search=${search}&page=${page}&limit=${pageSize}`)
    },
    getAuthors(page, pageSize) {
        return instance.get(`/api/author?page=${page}&limit=${pageSize}`)
    },
    getUnconfirmedOmSTU(page, pageSize){
        return instance.get(`/api/author/unconfirmed_omstu?page=${page}&limit=${pageSize}`)
    },
    getUnconfirmedOmSTUSearch(search, page, pageSize){
        return instance.get(`/api/author/unconfirmed_omstu?search=${search}&page=${page}&limit=${pageSize}`)
    }
}

export const FeedbackAPI = {

    getFeedback(page, pageSize) {
        return instance.get(`/api/admin/feedbacks?page=${page}&limit=${pageSize}`)
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
