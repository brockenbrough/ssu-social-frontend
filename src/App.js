import React, { createContext, useState, useEffect, useRef } from "react";
import { DarkModeProvider } from "./components/DarkModeContext";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/navbar";
import ContributorList from "./components/project-notes/contributorListPage";
import EditContributor from "./components/project-notes/editContributor";
import CreateContributor from "./components/project-notes/createContributor";
import Login from "./components/users/Login";
import Signup from "./components/register/Register";
import ForYouPage from "./components/post/forYouPage";
import PublicFeedPage from "./components/post/publicFeedPage";
import EditUserPage from "./components/users/editUserPage";
import EditUserBio from "./components/users/editUserBio";
import PublicProfilePage from "./components/users/PublicProfilePage";
import PublicUser from "./components/users/PublicUser";
import PrivateUserProfile from "./components/users/PrivateUserProfile";
import FollowerList from "./components/following/followerListPage";
import FollowingList from "./components/following/followingListPage";
import FollowCompsTestPage from "./components/following/followCompsTestPage";
import CommentList from "./components/comments/commentListPage";
import EditComment from "./components/comments/editComment";
import CreateComments from "./components/comments/createComment";
import PrivateUserLikeList from "./components/privateUserLikeList/PrivateUserLikeListPage";
import getUserInfo from "./utilities/decodeJwt";
import CreatePost from "./components/post/createPost";
import GetAllPost from "./components/post/getAllPost";
import UpdatePost from "./components/post/updatePost";
import UploadImages from "./components/images/uploadImages";
import ViewImages from "./components/images/viewImages";
import GetToken from "./components/getToken";
import useRefreshTokenOnActivity from "./components/hooks/refreshTokenOnActivity";
import SearchPage from "./components/search/SearchPage";
import SearchResultsPosts from "./components/search/SearchResultsPosts";
import SearchResultsProfiles from "./components/search/SearchResultsProfiles";

import Test from "./Test";

export const UserContext = createContext();
export const PostContext = createContext();
export const PostPageContext = createContext();

const App = () => {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [page, setSetPage] = useState(1);
  const location = useLocation(); // Get the current location

  useRefreshTokenOnActivity();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const hideNavbarPaths = ["/", "/signup"]; // Path to hide the Navbar

  return (
    <DarkModeProvider>
      <PostContext.Provider value={[posts, setPosts]}>
      <PostPageContext.Provider value={[page, setSetPage]}>
        {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
        <UserContext.Provider value={user}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/editUserPage" element={<EditUserPage />} />
            <Route exact path ="/editUserBio" element={<EditUserBio />}/>
            <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
            <Route path="/privateUserLikeList" element={<PrivateUserLikeList />} />
            <Route path="/postLikedByPage" element={<postLikedByPage />} />
            <Route path="/publicProfilePage/:username" element={<PublicProfilePage />} />
            <Route path="/publicUser" element={<PublicUser />} />
            <Route path="/project-notes-contributors" element={<ContributorList />} />
            <Route path="/project-notes/editContributor/:id" element={<EditContributor />} />
            <Route path="/project-notes/create" element={<CreateContributor />} />
            <Route path="/project-notes/contributors" element={<ContributorList />} />
            <Route path="/feed-algorithm" element={<ForYouPage />} />
            <Route path="/publicFeed" element={<PublicFeedPage />} />
            <Route path="/comments/comment" element={<CommentList />} />
            <Route path="/comments/editComment/:id" element={<EditComment />} />
            <Route path="/test" element={<Test />} />
            <Route path="/followers/:id" element={<FollowerList />} />
            <Route path="/following/:id" element={<FollowingList />} />
            <Route path="/followCompsTestPage/:id" element={<FollowCompsTestPage />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/getallpost" element={<GetAllPost />} />
            <Route path="/updatepost/:postId" element={<UpdatePost />} />
            <Route path="/createComment/:postId" element={<CreateComments />} />
            <Route path="/uploadImages" element={<UploadImages />} />
            <Route path="/viewImages" element={<ViewImages />} />
            <Route path="/get-token" element={<GetToken />} />
            <Route path="/searchPage" element={<SearchPage />}/>
            <Route path="/searchResultsPosts" element={<SearchResultsPosts />} />
            <Route path="/searchResultsProfiles" element={<SearchResultsProfiles/>}/>
            <Route path="/removeProfileImage" element={<PrivateUserProfile />} />
          </Routes>
        </UserContext.Provider>
      </PostPageContext.Provider>
      </PostContext.Provider>
    </DarkModeProvider>
  );
};

export default App;
