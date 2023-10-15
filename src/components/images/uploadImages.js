import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from '../../utilities/decodeJwt'

export default function UploadImages() {
  const [user, setUser] = useState({});
  const [name, setName] = useState(""); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUser(getUserInfo());
    return; 
  }, []);

  if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', user.username);
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
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Upload Images</h1>
  
      <div style={{ marginTop: '20px' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Username</label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              value={user.username}
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', color: 'gray' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Upload Image</label>
            <input type="file" id="image" name="image" accept="image/*" required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div style={{ marginBottom: '15px', display: 'flex' }}>
            <button type="submit" style={{ flex: 2, backgroundColor: '#4caf50', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Submit</button>
          </div>


        </form>
      </div>
  
      <hr style={{ marginTop: '20px' }} />
    </div>
    
  );
}
