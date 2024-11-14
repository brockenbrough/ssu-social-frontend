import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import Post from "./post";
import "./postlistStyle.css";
import ScrollToTop from "./ScrollToTop";
import Chat from "../chat/chat";
import { PostContext, PostPageContext } from "../../App";

const profileImageCache = {}; // Cache for profile images

function PostList({ type, profileUsername, searchInput }) {
  const POST_PER_PAGE = 10;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useContext(PostContext);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useContext(PostPageContext);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch user info
  const fetchUser = async () => {
    try {
      const user = await getUserInfoAsync();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [type]);

  useEffect(() => {
    if (user) {
      getPosts();
    }
  }, [user, page, searchInput]);

  // Fetch posts and pre-fetch profile images
  async function getPosts() {
    let url;

    if (type === "search" && searchInput) {
      url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/post/search/${searchInput}`;
    } else if (type === "feed") {
      url = user
        ? `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}`
        : `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`;
    } else if (type === "privateuserprofile") {
      url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostPageByUsername/${user.username}?page=${page}&postPerPage=${POST_PER_PAGE}`;
    } else if (type === "publicuserprofile") {
      url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostPageByUsername/${profileUsername}?page=${page}&postPerPage=${POST_PER_PAGE}`;
    } else if (type === "all") {
      url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostPage?page=${page}&postPerPage=${POST_PER_PAGE}`;
    }

    try {
      const response = await axios.get(url);
      const newPosts =
        type === "feed"
          ? await fetchFeedPosts(response.data.feed)
          : response.data;

      // Pre-fetch profile images
      await prefetchProfileImages(newPosts);

      setPosts((prev) => (page <= 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchFeedPosts = async (feed) => {
    const postsPromises = feed.map((postId) =>
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${postId}`
        )
        .then((res) => res.data)
        .catch((error) =>
          console.error(`Failed to fetch post ID ${postId}:`, error)
        )
    );
    return await Promise.all(postsPromises);
  };

  // Fetches and caches profile images for a batch of posts
  const prefetchProfileImages = async (posts) => {
    const fetchPromises = posts.map(async (post) => {
      const username = post.username;
      if (!profileImageCache[username]) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${username}`
          );
          profileImageCache[username] = response.data.profileImage || "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";
        } catch (error) {
          console.error(`Error fetching profile image for ${username}:`, error);
          profileImageCache[username] = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"; // Fallback image
        }
      }
    });

    await Promise.all(fetchPromises);
  };

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <>
      {isLoading && page === 1 ? (
        <div className="text-center pt-4">
          <img
            src="/loading.gif"
            alt="Loading..."
            className="w-12 h-12 inline-block"
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center text-xl -translate-y-1/3">
          {type === "feed" ? (
            <p className="text-gray-800 dark:text-white">
              <strong className="font-semibold">{user?.username}</strong>, your{" "}
              <strong className="font-semibold">For You Page</strong> is empty.
              <br />
              Visit the{" "}
              <Link
                to="/getallpost"
                className="text-blue-500 underline font-medium hover:text-blue-700"
              >
                Discover
              </Link>{" "}
              to explore posts from other users.
            </p>
          ) : (
            <p className="text-gray-800 dark:text-white">No posts available.</p>
          )}
        </div>
      ) : (
        <div className="ssu-post-list">
          {["all", "privateuserprofile", "publicuserprofile"].includes(type) ? (
            <div className="ssu-post-list">
              {posts.map((post, index) => {
                const isLastPost = posts.length === index + 1;

                return (
                  <div ref={isLastPost ? lastPostRef : null} key={post._id}>
                    <Post posts={post} isDiscover={type === "all"} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              {posts.map((post) => (
                <Post key={post._id} posts={post} isDiscover={type === "all"} />
              ))}
            </div>
          )}
          <Chat />
          <ScrollToTop />
        </div>
      )}
    </>
  );
}

export default PostList;
