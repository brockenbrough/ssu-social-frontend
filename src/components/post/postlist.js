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
import { useDarkMode } from "../DarkModeContext";
import { PostContext, RefreshPostsContext } from "../../App";

function PostList({ type, profileUsername }) {
  const POST_PER_PAGE = 5;
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useContext(PostContext);
  const [refreshPosts, setRefreshPosts] = useContext(RefreshPostsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

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
  }, [user, page, refreshPosts]);

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
      if (type === "feed") {
        const feed = response.data.feed;
        const postsPromises = feed.map((postId) =>
          axios
            .get(
              `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${postId}`
            )
            .then((res) => res.data)
            .catch((error) =>
              console.error(`Failed to fetch post with ID ${postId}:`, error)
            )
        );
        const postData = await Promise.all(postsPromises);
        setPosts(postData.filter((post) => post));
      } else {
        const newPosts = response.data;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length > 0);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <>
      {isLoading && page === 1 ? (
        <div className="text-center">
          <img
            src="/loading.gif"
            alt="Loading..."
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center" style={{ fontSize: "1.5em" }}>
          {type === "feed" ? (
            <p>
              <strong>{user.username}</strong>, your{" "}
              <strong>for you page </strong>is empty.<br></br> Visit the{" "}
              <Link to={"/getallpost"}>
                <a href="#">Discover</a>
              </Link>{" "}
              to discover posts from other users.
            </p>
          ) : type === "privateuserprofile" ? (
            <p>
              <strong>{user.username}</strong>, you haven't made any posts yet.
            </p>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      ) : (
        <div
          className="App"
          style={{
            backgroundColor: darkMode ? "#000" : "#f6f8fa",
            color: darkMode ? "#fff" : "#000",
            minHeight: "100vh",
          }}
        >
          {["all", "privateuserprofile", "publicuserprofile"].includes(type) ? (
            <div className="d-flex flex-column align-items-center">
              {posts.map((post, index) => {
                if (posts.length === index + 1) {
                  return (
                    <div ref={lastPostRef} key={post._id}>
                      <Post posts={post} className="cards m-2" />
                    </div>
                  );
                } else {
                  return (
                    <Post key={post._id} posts={post} className="cards m-2" />
                  );
                }
              })}
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              {posts.map((post) => {
                return (
                  <Post key={post._id} posts={post} className="cards m-2" />
                );
              })}
            </div>
          )}
          <ScrollToTop />
        </div>
      )}
    </>
  );
}

export default PostList;
