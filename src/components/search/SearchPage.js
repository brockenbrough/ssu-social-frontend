import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import axios from "axios";

function SearchPage() {
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUserInfoAsync();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  const fetchSearchResults = async () => {
    if (!searchInput) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/search/${searchInput}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchInput]);

  if (!user) {
    return (
      <div className="dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen pl-40">
        <h3>
          You are not authorized to view this page. Please Login{" "}
          <Link
            to="/login"
            className="text-gray-800 dark:text-white no-underline hover:text-orange-500"
          >
            here
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen pl-40">
      <div className="pt-4">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full max-w-md mx-auto block p-2 text-gray-900 dark:text-gray-800 dark:bg-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="pt-4">
        {searchInput && (
          <div className="w-full max-w-md mx-auto mb-4">
            <div className="p-3 border-b border-gray-300 hover:bg-orange-500 cursor-pointer hover:text-white">
              <Link to={`/searchResultsPosts/${searchInput}`}>
                <span>Search For: {searchInput}</span>
              </Link>
            </div>
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="w-full max-w-md mx-auto">
            {searchResults.map((result) => (
              <div
                key={result._id}
                className="p-3 border-b border-gray-300 hover:bg-orange-500 cursor-pointer hover:text-white"
              >
                <Link
                  to={
                    result.username === user.username
                      ? `/privateProfilePage`
                      : `/publicProfilePage/${result.username}`
                  }
                >
                  <span>@{result.username}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
