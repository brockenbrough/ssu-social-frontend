import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8095/statistics/user-likes'
})

export const postURL = axios.create({
    baseURL: 'http://localhost:80/posts'
})