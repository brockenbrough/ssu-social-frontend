import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./post";

export default function PostList() {
  const [posts, setPosts] = useState([]);


    async function getPosts() {
      try {
        // Call the new feed route (backend handles user context)
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`
        );

        // Feed now returns full post objects, no need for separate getPostById calls
        setPosts(res.data.feed);
      } catch (error) {
        console.error("An error has occurred while fetching feed data", error);
      }
    }

  useEffect(() => {
    getPosts();
  }, [posts.length]);

  return (
    <div>
      <h1>
        Discover
      </h1>

      <div>
        {posts.map(e => {
          return <Post posts = {e} isLiked={"true"}/>
        })}
      </div>
    </div>
  );
}