import React from "react";
import { useState } from "react";
import Header from "../Header/Header";
import Body from "../Body/Body";
import './Home.css';
import { useEffect } from "react";
import Footer from "../Footer/Footer";

const Home =({audiobooks,isLoggedIn,setIsLoggedIn,handleLogout})=>{

    const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);

    useEffect(() => {
        setFilteredAudiobooks(audiobooks);
    }, [audiobooks]);


    return(
        <div className="mainbody">
            <Header 
                audiobooks={audiobooks} 
                setFilteredAudiobooks={setFilteredAudiobooks} 
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}
            />
            <Body 
                audiobooks={filteredAudiobooks} 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn}
                />
            <Footer />
        </div>
    )
}

export default Home;