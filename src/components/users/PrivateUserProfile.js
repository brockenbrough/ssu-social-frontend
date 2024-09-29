import React, { useState, useEffect } from "react"; // Import necessary hooks from React for state and lifecycle management
import { Image } from "react-bootstrap"; // Import Bootstrap's Image component for profile image
import { Link, useNavigate } from "react-router-dom"; // Import Link and navigation hooks for routing
import axios from "axios"; // Import axios for making HTTP requests (unused but can be added for future API calls)
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync"; // Import custom function to fetch user information asynchronously
import { useDarkMode } from "../DarkModeContext.js"; // Import context hook to handle dark mode
import PostList from "../post/postlist"; // Import PostList component to display the user's posts

const PrivateUserProfile = () => {
  // Destructure darkMode value from DarkModeContext and set container styles based on it
  const { darkMode } = useDarkMode();
  const containerStyle = darkMode ? "bg-black text-white min-h-screen" : "bg-white text-black min-h-screen";

  // State variables to manage user data, follower, following, and likes count
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const navigate = useNavigate(); // Hook to programmatically navigate between pages

  // Function to fetch user information from an asynchronous utility
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfoAsync(); // Call function to get user info from a JWT token
      if (userInfo) {
        setUser(userInfo); // Set user state with the received data
        setUsername(userInfo.username); // Set username state
      }
    } catch (error) {
      console.error("Error fetching user info:", error); // Log error if user info fetch fails
    }
  };

  // UseEffect hook to fetch user data when the component is first rendered
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className={`${containerStyle} flex flex-col items-center`}> {/* Main container with responsive and styling based on dark mode */}
      {user ? ( /* Conditional rendering: if user data exists, show the profile */
        <>
          <div className="w-full max-w-2xl p-6"> {/* Profile wrapper with padding */}
            {/* Profile Section */}
            <div className="flex items-center justify-center mb-8"> {/* Centered profile image and info */}
              <div className="text-center">
                <Image 
                  src={user.profileImageUrl || "/default-profile.png"} // Display user's profile image or a default one if unavailable
                  roundedCircle 
                  className="object-cover w-32 h-32 mb-2 border-4 border-gray-300"
                />
                <p className="text-sm text-gray-500">{user.username}</p> {/* Username directly below the profile image */}
                
                <h1 className="mt-2 text-2xl font-bold">{user.name}</h1> {/* Centered name as a heading */}
                
                <div className="flex justify-center mt-4 space-x-8"> {/* Follower, Following, and Likes count */}
                  <div className="text-center">
                    <p className="text-lg font-bold">{followerCount}</p> {/* Display follower count as integer */}
                    <button onClick={() => navigate(`/followers/${username}`)} className="text-sm font-semibold">
                      followers
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{followingCount}</p> {/* Display following count as integer */}
                    <button onClick={() => navigate(`/following/${username}`)} className="text-sm font-semibold">
                      following
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{totalPosts}</p> {/* Display total likes as integer */}
                    <button className="text-sm font-semibold">
                      posts
                    </button>
                  </div>
                </div>

                <button onClick={() => navigate('/edit-profile')} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded">
                  Edit Profile {/* Button to navigate to edit profile page */}
                </button>
                <button onClick={() => navigate('/follow-requests')} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded">
                  Follow Requests {/* Button to navigate to edit profile page */}
                </button>
                <button onClick={() => navigate('/discover-people')} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded">
                  Discover {/* Button to navigate to edit profile page */}
                </button>
              </div>
            </div>

            {/* Posts Section */}
            <div className="grid grid-cols-3 gap-4"> {/* Display user's posts in a grid layout */}
              <PostList type="privateuserprofile" /> {/* PostList component fetching posts related to the user's profile */}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center"> {/* If user is not logged in, display a login prompt */}
          <p>Please <Link to="/" className="underline">log in</Link> to view your profile.</p>
        </div>
      )}
    </div>
  );
};

export default PrivateUserProfile; // Export component for use in the app