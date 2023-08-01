
import React, { useState, useEffect, Component } from "react"; 
import { useParams, useNavigate } from "react-router";


// Edit Component
export default function Home() {
  

   const [form, setForm] = useState({
     name: "",
   });
   const navigate = useNavigate();
    const params = useParams();

   // These methods will update the state properties.
   function updateForm(value) {
     return setForm((prev) => {
       return { ...prev, ...value };
     });
   }

   // This function will handle the submission.
   async function onSubmit(e) {
     e.preventDefault();

     // When a post request is sent to the create url, we'll add a new record to the database.
     const newTeam = { ...form };

     await fetch("http://localhost:5000/comments/add", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(newTeam),
     }).catch((error) => {
       window.alert(error);
       return;
     });

     setForm({ name: "" });
     navigate("/");
   }
   

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h1>Welcome to the amazing Social Media App!</h1>
      <br></br>
      <h3>Add a Comment</h3>
      {/* <form onSubmit={this.onSubmit} > */}
      <div className="form-group">
        <textarea
          rows="5"
          required
          className="form-control"
          // value={this.state.content}
          placeholder="Type a comment"
          // onChange={this.onChangeContent}
        ></textarea>
        <div className="form-group" align="right">
          <input
            type="submit"
            className="btn btn-dark"
            value="Post Comment"
          ></input>
        </div>
          {/* </form> */}

      </div>
    </div>
  );
}

