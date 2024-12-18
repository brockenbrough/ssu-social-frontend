import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import getUserInfoAsync from "../../utilities/decodeJwt";
import PostList from "../post/postlist";
import Chat from "../chat/chat";

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
        const url = `${
          process.env.REACT_APP_BACKEND_SERVER_URI
        }/post/search/${encodeURIComponent(searchInput)}`;
        const response = await axios.get(url);
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
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
    <div className="min-h-screen pl-40 dark:bg-gray-800">
      <div className="flex items-center justify-center py-4 space-x-2">
        <button
          onClick={() => {
            setIsPostsVisible(true);
            setSearchInput(""); // Clear the search input when switching to posts
          }}
          className={`ssu-nav-filter-btn ${
            isPostsVisible ? "ssu-nav-filter-btn-selected" : ""
          }`}
          style={{ padding: "9px 15px", fontSize: "1.15rem" }}
        >
          Posts
        </button>
        <button
          onClick={() => {
            setIsPostsVisible(false);
            setSearchInput(""); // Clear the search input when switching to profiles
          }}
          className={`ssu-nav-filter-btn ${
            !isPostsVisible ? "ssu-nav-filter-btn-selected" : ""
          }`}
          style={{ padding: "9px 15px", fontSize: "1.15rem" }}
        >
          Profiles
        </button>
      </div>
      <div className="pt-4">
        <input
          type="text"
          placeholder="Search for ..."
          className="block w-full max-w-md p-2 mx-auto text-gray-900 bg-gray-100 rounded-lg dark:text-gray-800 dark:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchInput}
          onChange={handleInputChange}
          maxLength={25}  // Set the character limit here
        />
      </div>
      <h2 className="pt-4 text-2xl font-bold text-center">
        Results for "{searchInput}"
      </h2>
      <div className="pt-4">
        {isPostsVisible ? (
          posts.length > 0 ? (
            // Use PostList to display posts
            <PostList type="search" searchInput={searchInput} />
          ) : (
            <p className="text-center">No posts found.</p>
          )
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <div
              key={profile._id}
              className="p-3 border-b border-gray-300 cursor-pointer hover:bg-orange-500 hover:text-white"
              onClick={() => handleUsernameClick(profile.username)}
            >
              <div className="flex items-center space-x-3">
                {/* Profile Picture */}
                <img
                  src={
                    profile.profileImage ||
                    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"
                  }
                  alt="Profile"
                  className="object-cover w-10 h-10 rounded-full"
                />
                {/* Username */}
                <span className="text-gray-900 ssu-textlink-bold font-title dark:text-white">
                  @{profile.username}
                </span>
              </div>
              {/* Add the user's bio here */}
              {profile.biography && (
                <div className="pt-2 text-sm text-gray-700 dark:text-gray-300">
                  {profile.biography}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No profiles found.</p>
        )}
      </div>

      <Chat />
    </div>
  );
}

export default SearchPage;
