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
  }, [user, page]); // refetch posts whenever page increments



  // Fetch posts and pre-fetch profile images
      async function getPosts() {
        if (!user) return;
        setIsLoading(true);

        
        try {
          const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}?page=${page}&limit=${POST_PER_PAGE}`;
          const res = await axios.get(url);
          const newPosts = res.data || [];

          const normalizedPosts = newPosts.map(p => ({
            ...p,
            profileImage: p.profileImage || "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png",
            likeCount: p.likeCount ?? 0,
            commentCount: p.commentCount ?? 0,
            viewCount: p.viewCount ?? 0,
            followerCount: p.followerCount ?? 0,   // use feed batch data
            followingCount: p.followingCount ?? 0,
          }));

          setPosts(prev => page === 1 ? normalizedPosts : [...prev, ...normalizedPosts]);
          setHasMore(newPosts.length === POST_PER_PAGE);

        } catch (error) {
          console.error("Failed to fetch posts:", error);
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
              {posts.map((post, index) => (
                <Post 
                  key={post._id} 
                  posts={post} 
                  isDiscover={type === "all"} 
                  profileImage={post.profileImage || "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"}  
                  followerCount={post.followerCount}
                  followingCount={post.followingCount} 
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
