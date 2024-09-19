import React from "react";
import PostList from "./postlist";
import { useDarkMode } from '../DarkModeContext';

function GetAllPostsPage() {
    const { darkMode } = useDarkMode();

    return (
        <div style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000", minHeight: '100vh', }}>
        <h2 style={{textAlign: 'center'}}>Welcome to the explore page</h2>
            <PostList type="all" />
        </div>
    );
}

export default GetAllPostsPage;
