import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';

const Signup = ({ closeModal,handleSignup }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }
        try {
            const signupResponse = await axios.post('http://localhost:5000/api/users/signup', { name, email, password });
            console.log('Signup request data:', { name, email, password });
            console.log('Signup response:', signupResponse.data);
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            handleSignup(response.data);
            closeModal();
        } catch (error) {
            console.error('Error signing up', error.response ? error.response.data : error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1 className="heading">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-data">User Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-data">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-data">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-data">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="button mt-20" type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
