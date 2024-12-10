import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/apiEndpoints';
import './css/Login.css';
import logo from '../images/logo192.png';
import {useAuth} from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="left-section">
                    <div className="brand-content">
                        <img src={logo} alt="Company Logo" className="company-logo" />
                        <h1>iTime</h1>
                        <p className="tagline">Streamline Your Time Management</p>
                    </div>
                </div>

                <div className="right-section">
                    <div className="login-form-container">
                        <h2>Welcome Back!</h2>
                        <p className="login-subtitle">Please login to your account</p>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="login-button">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
