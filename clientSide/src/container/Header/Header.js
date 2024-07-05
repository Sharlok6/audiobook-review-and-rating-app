import React, { useState } from "react";
import './Header.css';
import Card from '../Card/Card';
import Login from '../Login/Login';
import Signup from '../SignUp/SignUp';
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faSignIn, faUser,faUserPlus } from '@fortawesome/free-solid-svg-icons';
import IconWithText from "../IconWithText/IconWithText";

const Header = ({ audiobooks, setFilteredAudiobooks, isLoggedIn,setIsLoggedIn, handleLogout  })=>{
    const [filter, setFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedName = localStorage.getItem('name');
        if (storedEmail && storedName) {
            setEmail(storedEmail);
            setName(storedName);
            setIsLoggedIn(true);
        }
    }, []);

    const handleFilterChange = (event) => {
        const selectedFilter = event.target.value;
        setFilter(selectedFilter);
        setSearchQuery(''); // Clear search query when filter is used

        const sorted = [...audiobooks].sort((a, b) => {
            if (selectedFilter === 'genre') {
                return a.genre.localeCompare(b.genre);
            } else if (selectedFilter === 'title') {
                return a.title.localeCompare(b.title);
            } else if (selectedFilter === 'author') {
                return a.author.localeCompare(b.author);
            }
            return 0;
        });

        setFilteredAudiobooks(sorted);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setFilter(''); // Clear filter when search is used

        //filter method of array is array is used to find the audiobook
        const filtered = audiobooks.filter(audiobook =>
            audiobook.title.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredAudiobooks(filtered);
    };
    const handleLogin = (email, userName, authToken) => {
        //console.log("Login userData:", email, userName, authToken);
        setEmail(email);
        setName(userName);
        setIsLoggedIn(true);
        setShowLogin(false); // Close login modal if login is successful
        localStorage.setItem('email', email);
        localStorage.setItem('name', userName);
        localStorage.setItem('authToken', authToken); // Store authToken in localStorage
    };

    const handleSignup = (userData) => {
        const { email, username } = userData.user;
        setEmail(email);
        setName(username);
        setIsLoggedIn(true);
        setShowSignup(false); // Close signup modal if signup is successful
        localStorage.setItem('email', email);
        localStorage.setItem('name', username);
    };

    const closeModal = () => {
        setShowLogin(false);
        setShowSignup(false);
    };

    return(
        <div className="outer">
            <div className="middle">
            <div className="inner">
                <div className="punchline">
                    <h2 className="first">Listen to your favouraite</h2>
                    <h1 className="second">audiobooks!</h1>
                </div>
                <div className="fields">
                    <div className="filter">
                        <label htmlFor="Type">Filter By:</label>
                        <select id="filter" placeholder="Select" value={filter} onChange={handleFilterChange}>
                            <option value="">Select Filter</option>
                            <option value="genre">Genre</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                        </select>
                    </div>
                    <input 
                        className="searchBox" 
                        type="text" 
                        placeholder="Search audiobook"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        />
                </div>
                
            </div>
            <div className="container">
                <div className="logSign">
                {!isLoggedIn ? (
                        <>
                            <button className="loginbtn" onClick={() => setShowLogin(true)}>
                                <FontAwesomeIcon icon={faSignIn} /> Login
                            </button>
                            <button className="signupbtn" onClick={() => setShowSignup(true)}>
                                <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                            </button>
                        </>
                        ) : (
                            <>
                            <h2 className="loginheading">Welcome, {name}!</h2>
                            <div className="tooltip">
                                <button className="logoutbtn" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faUser} /> {name}
                                </button>
                                <div className="tooltiptext">
                                <IconWithText className="tooltiptext" text="Logout"/>
                                </div>

                            </div>
                            </>
                )}
                </div>
                {showLogin && <Login handleLogin={handleLogin} closeModal={closeModal} />}
                {showSignup && <Signup handleSignup={handleSignup} closeModal={closeModal} />}
            </div>
            </div>
        </div>
    )
}
export default Header;