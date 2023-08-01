import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import getUserInfo from '../../utilities/decodeJwt'
import './homepage.css'
const HomePage = () => {
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const handleClick = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken')
        return navigate('/')
    }

    useEffect(() => {
        setUser(getUserInfo())
    }, [])


    if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)
    const { id, email, username, password } = user
    return (
        <>
            <div>
                <h2>
                    Welcome
                    <span className='username'> @{username}</span>
                </h2>
                <h2>
                    Your userId in mongo db is
                    <span className='userId'> {id}</span>
                </h2>
                <h2>
                    Your registered email is
                    <span className='email'> {email}</span>
                </h2>
                <h2>
                    Your password is
                    <span className='password'> {password} ( hashed )</span>
                </h2>
            </div>
            <button onClick={(e) => handleClick(e)}>
                Log Out
            </button>
        </>
    )
}

export default HomePage