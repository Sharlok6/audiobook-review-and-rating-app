import React from 'react';
import './Card.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from '../Login/Login';
import Signup from '../SignUp/SignUp';

const Card = ({ _id,id, title, author, genre, imageUrl, isLoggedIn,setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);


    const handleClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowLogin(true); // Adjust route as per your setup
            alert("Please log in or sign up first!");
        } else {
            // Redirect to audiobook detail page
            navigate(`/audiobooks/${_id}`);
        }
    };

    const handleLogin = (email, userName, authToken) => {
        setIsLoggedIn(true);
        setShowLogin(false);
        localStorage.setItem('email', email);
        localStorage.setItem('name', userName);
        localStorage.setItem('authToken', authToken);
    };

    const handleSignup = (userData) => {
        const { email, username } = userData.user;
        setIsLoggedIn(true);
        setShowSignup(false);
        localStorage.setItem('email', email);
        localStorage.setItem('name', username);
    };

    const closeModal = () => {
        setShowLogin(false);
        setShowSignup(false);
    };

    return (
        <div className="card">
            <div onClick={handleClick}>
                <img className='card-image' src={imageUrl} alt={title} />
                <div className="card-content">
                    <h3 className='card-title'>{title}</h3>
                    <p className='card-author'>{author}</p>
                    <p className='card-genre'>{genre}</p>
                    {/* <p className='card-genre'>{_id}</p> */}
                </div>
            </div>
            {showLogin && <Login handleLogin={handleLogin} closeModal={closeModal} />}
            {showSignup && <Signup handleSignup={handleSignup} closeModal={closeModal} />}
        </div>
    );
};

export default Card;
