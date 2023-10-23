import React from "react";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import PostList from "./postlist";
import { useDarkMode } from '../DarkModeContext';   

function FeedPage() {
    const { darkMode } = useDarkMode();
    const user = getUserInfo();

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

    return <PostList type="feed" username={user.username} />;
}

export default FeedPage;
