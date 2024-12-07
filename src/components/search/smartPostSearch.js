import React, { useState, useEffect } from "react";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import Post from "../post/post";

function SmartPostSearch() {
 const userInfo = getUserInfo();
  const userId = userInfo?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Search query cannot be empty.");
      setResults([]); 
      return;
    }

    if (!userId) {
      setError("User ID is not available. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/smartPostSearch/${userId}`,
        { query: searchQuery },
        { headers: { "Content-Type": "application/json" } }
      );
      setResults(response.data.results || []);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during the search process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Post
      </h1>
      <div className="pt-4">
        <input
          type="text"
          placeholder="Search"
          className="block w-full max-w-lg p-3 mx-auto text-gray-900 bg-gray-100 rounded-lg dark:text-gray-800 dark:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="block px-6 py-2 mx-auto mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="pt-6">
        {results.length > 0 ? (
          <div >
            {results.map((post) => (
              <Post key={post._id} posts={post} /> 
            ))}
          </div>
        ) : (
          !loading &&
          !error &&
          searchQuery.trim() &&!loading && <p className="text-center">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SmartPostSearch;
