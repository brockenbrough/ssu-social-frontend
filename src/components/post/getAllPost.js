import React from "react";
import PostList from "./postlist";

function GetAllPostsPage() {
  // className="bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow min-h-screen"
  // className="bg-white dark:bg-gray-800 text-center"
  return (
    <div class="dark:bg-gray-800">
      <div className="pt-4 mb-3 font-bold text-3xl text-center text-grey-900 dark:text-white">
        Discover
      </div>
      <PostList type="all" />
    </div>
  );
}

export default GetAllPostsPage;
