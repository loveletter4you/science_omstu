import axios from 'axios';

const instance = axios.create({
    withCredentials: true
});

export const getAuthorPublication = (id = 1 , pageSize = 20) => {
    return instance.get(`/api/author/${id}/publications?page=0&limit=${pageSize}`)
    }
export const getAuthor = (id = 1) => {
    return instance.get(`/api/author/${id}/`)
}
