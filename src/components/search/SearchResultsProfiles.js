import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";

function SearchResultsProfiles() {
  const location = useLocation();
  const initialSearchInput = location.state?.searchInput || ""; // Get the initial search input
  const [searchInput, setSearchInput] = useState(initialSearchInput); // State for user input
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setCurrentUsername(userInfo.username);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch profiles based on search input
  const fetchProfiles = async () => {
    if (!searchInput) {
      setProfiles([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/search/${searchInput}`
      );
      setProfiles(response.data);
    } catch (err) {
      setError("Error fetching search results");
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [searchInput]);

  const handleUsernameClick = (username) => {
    if (username === currentUsername) {
      navigate(`/privateUserProfile`);
    } else {
      navigate(`/publicProfilePage/${username}`);
    }
  };

  return (
    <div className="pl-40 dark:bg-gray-800 min-h-screen">
      <div className="flex items-center justify-center py-4 space-x-2">
        {/* Posts Button */}
        <Link to={`/searchResultsPosts`} state={{ searchInput }}>
          <button className="ssu-button-primary" style={{ padding: '9px 15px', fontSize: '1.15rem' }}>Posts</button>
        </Link>
        {/* Profiles Button */}
        <Link to={`/searchResultsProfiles`} state={{ searchInput }}>
          <button className="ssu-button-disabled" style={{ padding: '9px 15px', fontSize: '1.15rem' }}>Profiles</button>
        </Link>
      </div>

      {/* Search input field */}
      <div className="pt-4">
        <input
          type="text"
          placeholder="Search for profiles..."
          className="w-full max-w-md mx-auto block p-2 text-gray-900 dark:text-gray-800 dark:bg-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="pt-4 mb-3 font-bold text-3xl text-center text-gray-900 dark:text-white">
        Results for "{searchInput}"
      </div>

      {loading ? (
        <div className="text-center text-gray-900 dark:text-white">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : profiles.length === 0 ? (
        <div className="text-center text-gray-900 dark:text-white">
          No profiles found for "{searchInput}"
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="p-3 border-b border-gray-300 hover:bg-orange-500 cursor-pointer hover:text-white"
              onClick={() => handleUsernameClick(profile.username)}
            >
              <span className="text-gray-900 dark:text-white no-underline">
                @{profile.username}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsProfiles;
