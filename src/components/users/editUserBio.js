import React, { useState, useEffect } from 'react';
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import apiClient from '../../utilities/apiClient';


const EditUserBio = () => {
  const [errors, setErrors] = useState({});
  const [form, setValues] = useState({ userId: "", biography: "" });

  // Fetch user info on mount
  useEffect(() => {
    getUserInfoAsync()
      .then(userInfo => {
        setValues({
          userId: userInfo.id,
          biography: userInfo.biography || ""
        });
      })
      .catch(error => {
        console.error('Error getting user info:', error);
      });
  }, []);

  const findFormErrors = () => {
    const { biography } = form;
    const newErrors = {};
    if (biography.length > 200) newErrors.biography = 'Your bio is too long!';
    return newErrors;
  };

  // Handle biography field change
  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...form, [input.id]: input.value });
    if (errors[input.id]) setErrors({ ...errors, [input.id]: null });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        console.log("Submitting biography update...");
        const response = await apiClient.put(`/update-bio/${form.userId}`, { biography: form.biography });
        
        if (response.status === 200) {
          console.log("Biography updated successfully, refreshing page...");
          window.location.reload(); // Automatically refreshes the page after the update
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error updating biography:", error);
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          window.alert(error.response.data.message);
        }
      }
    }
  };

  return (
    <form className="ssu-form-style" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="biography">
          Biography
        </label>
        <textarea
          id="biography"
          placeholder="Enter your bio"
          rows="4"
          value={form.biography}
          onChange={handleChange}
          className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border ${errors.biography ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        ></textarea>
        {errors.biography && (
          <p className="text-red-500 text-sm mt-1">{errors.biography}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="ssu-button-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default EditUserBio;
