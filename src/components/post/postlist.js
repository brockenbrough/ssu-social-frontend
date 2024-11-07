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

function PostList({ type, profileUsername, initialPosts = [] }) {
  const POST_PER_PAGE = 10;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useContext(PostContext);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useContext(PostPageContext);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts); // Set the posts from search results
      setIsLoading(false);
      setHasMore(initialPosts.length === POST_PER_PAGE);
    } else {
      getPosts(); // Fetch normally if initialPosts is empty
    }
  }, [initialPosts, type]);

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
  }, [user, page]);

  // Fetch posts
  async function getPosts() {
    let url;
    if (type === "feed") {
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
        <div className="ssu-text-titlesmall">
          {type === "feed" ? (
            <p>
              <strong>{user?.username}</strong>, your{" "}
              <strong>for you page </strong>is empty.
              <br />
              Visit the{" "}
              <Link to={"/getallpost"}>
                <a href="#">Discover</a>
              </Link>{" "}
              to discover posts from other users.
            </p>
          ) : (
            <p>No posts available.</p>
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
                    <Post
                      posts={post}
                      isDiscover={type === "all"}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              {posts.map((post) => (
                <Post
                  key={post._id}
                  posts={post}
                  isDiscover={type === "all"}
                />
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
