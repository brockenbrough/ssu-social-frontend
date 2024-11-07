import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import getUserInfoAsync from "../../utilities/decodeJwt";
import PostList from "../post/postlist";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearchInput = location.state?.searchInput || ""; 
  const [searchInput, setSearchInput] = useState(initialSearchInput); 
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isPostsVisible, setIsPostsVisible] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUserInfoAsync();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  // Fetch posts matching the search input
  useEffect(() => {
    const fetchPosts = async () => {
      if (!searchInput) {
        setPosts([]);
        return;
      }
      try {
        const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/post/search/${encodeURIComponent(searchInput)}`;
        const response = await axios.get(url);
        const sortedPosts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [searchInput]);

  // Fetch profiles based on search input
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!searchInput) {
        setProfiles([]);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/search/${searchInput}`
        );
        setProfiles(response.data);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };
    fetchProfiles();
  }, [searchInput]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleUsernameClick = (username) => {
    if (username === user?.username) {
      navigate(`/privateUserProfile`);
    } else {
      navigate(`/publicProfilePage/${username}`);
    }
  };

  return (
    <div className="pl-40 dark:bg-gray-800 min-h-screen">
      <div className="flex items-center justify-center py-4 space-x-2">
        <button
          onClick={() => setIsPostsVisible(true)}
          className={`ssu-nav-filter-btn ${isPostsVisible ? "ssu-nav-filter-btn-selected" : ""}`}
          style={{ padding: '9px 15px', fontSize: '1.15rem' }}
        >
          Posts
        </button>
        <button
          onClick={() => setIsPostsVisible(false)}
          className={`ssu-nav-filter-btn ${!isPostsVisible ? "ssu-nav-filter-btn-selected" : ""}`}
          style={{ padding: '9px 15px', fontSize: '1.15rem' }}
        >
          Profiles
        </button>
      </div>
      <div className="pt-4">
        <input
          type="text"
          placeholder="Search for ..."
          className="w-full max-w-md mx-auto block p-2 text-gray-900 dark:text-gray-800 dark:bg-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchInput}
          onChange={handleInputChange}
        />
      </div>
      <h2 className="text-2xl font-bold pt-4 text-center">Results for "{searchInput}"</h2>
      <div className="pt-4">
        {isPostsVisible ? (
          posts.length > 0 ? (
            // Use PostList to display posts
            <PostList type="search" initialPosts={posts} />
          ) : (
            <p>No posts found.</p>
          )
        ) : (
          profiles.length > 0 ? (
            profiles.map((profile) => (
              <div
                key={profile._id}
                className="p-3 border-b border-gray-300 hover:bg-orange-500 cursor-pointer hover:text-white"
                onClick={() => handleUsernameClick(profile.username)}
              >
                <span className="ssu-textlink-bold font-title text-gray-900 dark:text-white">
                  @{profile.username}
                </span>
              </div>
            ))
          ) : (
            <p>No profiles found.</p>
          )
        )}
      </div>
    </div>
  );
}

export default SearchPage;
