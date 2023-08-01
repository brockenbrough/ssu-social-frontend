 import { useState } from "react";
 import ListComments from "./ListComments";
import React from "react";

 
 const CommentsHome = ({
   handleSubmit,
   submitLabel,
   hasCancelButton = false,
   handleCancel,
   initialText = "",
 }) => {
   const [text, setText] = useState(initialText);
   const isTextareaDisabled = text.length === 0;
   const onSubmit = (event) => {
     event.preventDefault();
     handleSubmit(text);
     setText("");
   };

   return (
     <>
       <div>
         <h1>"SOCIAL MEDIA POST"</h1>
         <img
           class="posterImageProfile"
           src="https://img.freepik.com/free-photo/medium-shot-happy-family-nature_23-2148996570.jpg?w=2000"
           alt="Avatar"
         ></img>
         <div className="caption">Posted by: John Bisque</div>
         <div className="caption"> Our amazing vacation!😊 </div>
         <img
           class="posterImage"
           src="https://lh3.googleusercontent.com/p/AF1QipOqRHXNs0CvXZCaE515mjx-8ViqTZsmNRaDRynh=s1360-w1360-h1020"
           alt="alternatetext"
         ></img>

         <ListComments
           commentsUrl="http://localhost:3004/comments"
           currentUserId="1"
         />
       </div>
     </>
   );
 };

export default CommentsHome;