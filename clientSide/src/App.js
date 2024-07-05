import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './container/Home/Home';
import AudiobookDetail from './container/AudioBookDetail/AudioBookDetail';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = ()=> {
  const [audiobooks,setAudiobooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in based on stored credentials
    const checkLoggedInStatus = () => {
        const storedEmail = localStorage.getItem('email');
        const storedName = localStorage.getItem('name');
        if (storedEmail && storedName) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    checkLoggedInStatus();
}, []);

  useEffect(()=>{
    const fetchedAudiobooks = async ()=>{
        try{
            const res = await axios.get('http://localhost:5000/api/audiobooks');
            console.log(res.data);
            setAudiobooks(res.data);
        } catch(error){
            console.log('Error fetching audiobooks : ',error);
        }
    };
    fetchedAudiobooks();
  },[]);

  const handleLogin = (email, name, authToken) => {
    console.log("data received in handlelogin: ",email, name, authToken)
    // Update isLoggedIn state and store user credentials and authToken in localStorage
    setIsLoggedIn(true);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('authToken', authToken); // Store authToken in localStorage
};


  const handleLogout = () => {
      // Clear isLoggedIn state and remove stored credentials from localStorage
      setIsLoggedIn(false);
      localStorage.removeItem('email');
      localStorage.removeItem('name');
  };

  return (
      <Router>
        <Routes>
          <Route 
                path='/' 
                exact 
                element={<Home 
                audiobooks={audiobooks} 
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}/>} />
          <Route 
                path="/audiobooks/:id" 
                element={<AudiobookDetail 
                audiobooks={audiobooks} 
                setAudiobooks={setAudiobooks}
              />} />
        </Routes>
      </Router>
  );
}

export default App;
