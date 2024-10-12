import React, { useState, useEffect } from 'react';
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import apiClient from '../../utilities/apiClient';

const EditUser = () => {
  const url = `/user/editUser`;

  // form validation checks
  const [ errors, setErrors ] = useState({});

  const findFormErrors = () => {
    const {username, email, password, biography} = form;
    const newErrors = {}
    // username validation checks
    if (!username || username === '') newErrors.name = 'Input a valid username'
    else if (username.length < 6) newErrors.name = 'Username must be at least 6 characters'
    // email validation checks
    if (!email || email === '') newErrors.email = 'Input a valid email address'
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Input a valid email address'
    // password validation checks
    if (!password || password === '') newErrors.password = 'Input a valid password'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    // biography character limit check
    if (biography.length > 200) newErrors.biography = 'Your bio is too long!'
    return newErrors
  }

  // initialize form values and get userId on render
  const[form, setValues] = useState({userId: "", username: "", email: "", password: "", biography: ""});
  useEffect(() => {
    getUserInfoAsync()
      .then(userInfo => {
        setValues({
          userId: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
          biography: userInfo.biography
        })
      })
      .catch(error => {
        console.error('Error getting user info:', error);
      });
  }, [])

  // handle form field changes
  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...form, [input.id]: input.value });
    if ( !!errors[input] ) setErrors({
      ...errors,
      [input]: null
    })
  };

  // handle form submission with submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors()
    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    }
    else {
      try {
        const { data: res } = await apiClient.put(url, form);
        const { accessToken } = res;
        //store token in localStorage
        localStorage.setItem("accessToken", accessToken);
        window.location.reload(true);
      } catch (error) {
      if (
        error.response &&
        error.response.status !== 409 &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        window.alert(error.response.data.message);
      }
      if (error.response &&
        error.response.status === 409
      ) {
        setErrors({name : "Username is taken, pick another"})
      }
    }
    }
  }

  return (
    <form className="ssu-form-style">
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Enter new username"
          value={form.username}
          disabled={true}
          onChange={handleChange}
          className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {errors.username}
          </p>
        )}
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="email">
          Email address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter new email address"
          value={form.email}
          onChange={handleChange}
          className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-white font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter new password"
          value={form.password}
          onChange={handleChange}
          className={`w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>
  
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
          <p className="text-red-500 text-sm mt-1">
            {errors.biography}
          </p>
        )}
      </div>
  
      <div className="flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="ssu-button-primary"
        >
          Submit
        </button>
      </div>
    </form>
  )  
}

export default EditUser;