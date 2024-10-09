import React from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import PostList from "./postlist";

function ForYouPage() {
  const user = getUserInfoAsync();

  if (!user) {
    return (
      <div className="dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen pl-40">
        <h3>
          You are not authorized to view this page. Please Login in{" "}
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
      <div className="pt-4 mb-3 font-bold text-3xl text-center">For you</div>
      <PostList type="feed" username={user.username} />
    </div>
  );
}

export default ForYouPage;
