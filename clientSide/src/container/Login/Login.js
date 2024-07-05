import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ closeModal,handleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log('Submitting login form', { email, password }); 
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            //console.log('Login response:', response.data);
            
            const {token, user}=response.data;
            const { email: userEmail, name: username,id:userId } = user; // Ensure correct field names
            
            //console.log(userEmail, username, token);
            handleLogin(userEmail, username, token); // Pass userEmail, username, and token to handleLogin
            closeModal();
        } catch (error) {
            console.error('Error logging in', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1 className='heading'>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className='form-data'>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className='form-data'>Password:</label>
                        <input
                            className='lastinput'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="button mt-20" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
