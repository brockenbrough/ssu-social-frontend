import React, { useState, useEffect,useContext } from 'react';
import api, { postURL } from './api/api';
import Post from '../post/post';
import { UserContext } from '../../App';


const PrivateUserLikeListPage = () => {
    //Setting active user
    const [post, setPost] = useState([])
    const user = useContext(UserContext)
    useEffect(() => {
        const fetchLikes = async () => {
                    await api.get(`/${user.id}`).then(e => {
                        /**
                         * Iterates through the array of objects
                         * For every like object, we want to find a post that matches the like's postId 
                         */
                        e.data.map(async (e) => {
                            const res = await postURL.get(`/getPostById/${e.postId}`)
                            //"...post" appeneds res.data to our post array to prevent overriting 
                            setPost(e => [...e,res.data])
                            //setPost(res.data)
                        })
                    })
        }
        fetchLikes()
    }, [user])

    return (
        <div>
            {post.map(e => {
                //Renders the posts if the post is not null
                if(e){
               return <Post  posts = {e} isLiked={"true"}/>
            }
            })}
        </div>
    )
}

export default PrivateUserLikeListPage