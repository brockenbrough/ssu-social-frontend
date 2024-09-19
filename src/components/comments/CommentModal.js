import React from "react";
import CreateComment from "./createComment";
import DarkModeButton from "../DarkModeButton";
import { useDarkMode } from "../DarkModeContext";

export default function CommentModal({ postId, setCommentCount }) {
  const { darkMode } = useDarkMode();

  return (
    <CreateComment
      postId={postId}
      setParentCommentCount={setCommentCount}
      style={{
        backgroundColor: darkMode ? "#181818" : "#f6f8fa",
        color: darkMode ? "white" : "black",
      }}
    />
  );
}
