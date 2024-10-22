import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostList from "/Users/seanbolles/ssu_social/ssu-social-frontend/src/components/post/postlist";

function SearchResultsPosts() {
  const { searchInput } = useParams(); // Get the search input from URL parameters
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/post/search/${searchInput}`
        );
        setPosts(response.data);
      } catch (err) {
        setError("Error fetching search results");
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchInput]);

  return (
    <div className="pl-40 dark:bg-gray-800 min-h-screen">
      <div className="pt-4 mb-3 font-bold text-3xl text-center text-gray-900 dark:text-white">
        Search Results for "{searchInput}"
      </div>
      {loading ? (
        <div className="text-center text-gray-900 dark:text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-900 dark:text-white">
          No posts found for "{searchInput}"
        </div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}

export default SearchResultsPosts;
