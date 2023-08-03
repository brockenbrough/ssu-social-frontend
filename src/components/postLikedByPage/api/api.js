import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_SERVER_URI}/statistics/post-likes`
})

export const postURL = axios.create({
    baseURL: `http://localhost:/posts`
})