import React from "react";
import PostList from "./postlist";

function GetAllPostsPage() {
  return (
    <div class="pl-40 dark:bg-gray-800">
      <div className="pt-4 mb-3 font-bold text-3xl text-center text-grey-900 dark:text-white">
        Discover
      </div>
      <PostList type="all" />
    </div>
  );
}

export default GetAllPostsPage;
