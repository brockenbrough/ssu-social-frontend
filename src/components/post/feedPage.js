import React from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import PostList from "./postlist";
import { useDarkMode } from '../DarkModeContext';   

function FeedPage() {
    const { darkMode } = useDarkMode();
    const user = getUserInfoAsync();

    if (!user) {
        return (
            <div>
                <h3>
                    You are not authorized to view this page. Please Login in{" "}
                    <Link to="/login">here</Link>
                </h3>
            </div>
        );
    }

    return (
        <div style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000"}}>
            <h2 style={{textAlign: 'center'}}>Welcome to your feed, {user.username}</h2>
            <PostList type="feed" username={user.username} />
        </div>
    );
}

export default FeedPage;
