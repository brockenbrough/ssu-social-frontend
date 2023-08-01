import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8095/statistics/post-likes'
})

export const postURL = axios.create({
    baseURL: 'http://localhost:/posts'
})