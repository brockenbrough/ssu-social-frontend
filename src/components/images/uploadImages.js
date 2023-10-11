import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from '../../utilities/decodeJwt'

export default function UploadImages() {
  const [user, setUser] = useState({});
  const [name, setName] = useState(""); 
  const [desc, setDesc] = useState(""); 

  useEffect(() => {
    setUser(getUserInfo());
    return; 
  }, []);

  if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('image', e.target.elements.image.files[0]);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/create`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.msg);
      } else {
        alert('Image was not saved. HTTP status code: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>

      <div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="name">Image Title</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="desc">Image Description</label>
            <textarea
              id="desc"
              name="desc"
              value={desc}
              rows="2"
              placeholder="Description"
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input type="file" id="image" name="image" accept="image/*" required />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      <hr />
    </div>
  );
}
