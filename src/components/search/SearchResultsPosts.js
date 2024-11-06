import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getUserInfoAsync from "../../utilities/decodeJwt";

function SearchResultsPosts() {
  const location = useLocation();
  const initialSearchInput = location.state?.searchInput || ""; // Get the initial search input
  const [searchInput, setSearchInput] = useState(initialSearchInput); // State for user input
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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
        setPosts([]); // Clear posts if no search input
        return;
      }
  
      try {
        const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/post/search/${encodeURIComponent(searchInput)}`;
        const response = await axios.get(url);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts();
  }, [searchInput]);
  

  // Handle enter key press for search
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
    }
  };

  // Handle input change to update the search input state
  const handleInputChange = (event) => {
    setSearchInput(event.target.value); // Update the search input
  };

  return (
    <div className="pl-40 dark:bg-gray-800 min-h-screen">
      <div className="flex items-center justify-center py-4 space-x-2">
        <Link to={`/searchResultsPosts`} state={{ searchInput }}>
          <button className={`ssu-nav-filter-btn ${searchInput ? "ssu-nav-filter-btn-selected" : ""}`} style={{ padding: '9px 15px', fontSize: '1.15rem' }}>
            Posts
          </button>
        </Link>
        <Link to={`/searchResultsProfiles`} state={{ searchInput }}>
          <button className={`ssu-nav-filter-btn`} style={{ padding: '9px 15px', fontSize: '1.15rem' }}>
            Profiles
          </button>
        </Link>
      </div>
      {/* Search input field */}
      <div className="pt-4">
        <input
          type="text"
          placeholder="Search for posts..."
          className="w-full max-w-md mx-auto block p-2 text-gray-900 dark:text-gray-800 dark:bg-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchInput}
          onChange={handleInputChange} // Handle input changes
          onKeyDown={handleKeyDown} // Handle enter key press
        />
      </div>
      <h2 className="text-2xl font-bold pt-4">Results for "{searchInput}"</h2>
      <div className="pt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-3 border-b border-gray-300 hover:bg-orange-500 cursor-pointer hover:text-white"
            >
              <Link
                to={
                  user && post.username === user.username
                    ? `/privateUserProfile`
                    : `/publicProfilePage/${post.username}`
                }
              >
                <p className="font-bold">@{post.username}</p>
              </Link>
              <p>{post.content}</p>
              {post.imageUri && (
                <img
                  src={post.imageUri}
                  alt="Post content"
                  className="w-full h-auto mt-2 rounded-lg"
                />
              )}
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPosts;
