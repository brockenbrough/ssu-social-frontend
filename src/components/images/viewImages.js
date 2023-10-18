import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from '../../utilities/decodeJwt'

export default function ViewImages() {
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]);

  useEffect(() => {
    setUser(getUserInfo());
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/getAll`);
      const data = await response.json();
      setImages(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}>here</Link></h3></div>);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#333' }}>View Images</h1>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', margin: '10px', padding: '15px', width: '300px' }}>
            <h5 style={{ fontSize: '18px', color: '#444' }}>Image Title: {image.name}</h5>
            <p style={{ fontSize: '14px', color: '#666' }}>Image Description: {image.desc}</p>
            <img
              src={`data:${image.img.contentType};base64,${image.base64Data}`}
              alt={image.name}
              style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
            />
          </div>
        ))}
      </div>

      <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />
    </div>
  );
}
