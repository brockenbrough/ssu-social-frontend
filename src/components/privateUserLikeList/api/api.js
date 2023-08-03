import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_SERVER_URI}/statistics/user-likes`
})

export const postURL = axios.create({
    baseURL: `http://localhost:80/posts`
})