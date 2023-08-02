import React from "react";

import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";
import ContributorList from "./components/project-notes/contributorListPage";
import EditContributor from "./components/project-notes/editContributor";
import CreateContributor from "./components/project-notes/createContributor";
import LandingPage from "./components/users/Landingpage";
import Login from "./components/users/Login";
import Signup from "./components/register/Register";
import Feed from "./components/feed/Feed";
import FeedPage from "./components/post/feedPage";
import PublicFeedPage from "./components/post/publicFeedPage";
import EditUserPage from "./components/users/editUserPage";
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

import Test from "./Test";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/editUserPage" element={<EditUserPage />} />
          <Route path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route path="/privateUserLikeList"  element={<PrivateUserLikeList />}/>
          <Route path="/postLikedByPage" element={<postLikedByPage />}/>
          <Route path="/publicProfilePage/:username" element={<PublicProfilePage />} />
          <Route path="/publicUser" element={<PublicUser />} />
          <Route path="/project-notes-contributors" element={<ContributorList />}/>
          <Route path="/project-notes/editContributor/:id" element={<EditContributor />} />
          <Route path="/project-notes/create" element={<CreateContributor />} />
          <Route path="/project-notes/contributors" element={<ContributorList />}/>
          <Route path="/oldfeed" element={<Feed />} />
          <Route path="/feed-algorithm" element={<FeedPage />} />
          <Route path="/publicFeed" element={<PublicFeedPage />} />
          <Route path="/comments/comment" element={<CommentList />} />
          <Route path="/comments/editComment/:id" element={<EditComment />} />
          <Route path="/comments/create" element={<CreateComments />} />
          <Route path="/test" element={<Test />} />
          <Route path="/followers/:id" element={<FollowerList />} />
          <Route path="/following/:id" element={<FollowingList />} />
          <Route path="/followCompsTestPage/:id" element={<FollowCompsTestPage />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/getallpost" element={<GetAllPost />} />
          <Route path="/updatepost/:postId" element={<UpdatePost />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
