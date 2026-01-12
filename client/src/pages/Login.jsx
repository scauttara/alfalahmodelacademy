import React, { useState } from "react";
import { api } from '../utils/api.js';
import Header from "../components/Header/Header.jsx"; // Use the branding header
import './Login.scss';
import NavBar from "../components/NavBar/NavBar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState(''); // To style success vs error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Logging in...');
        setStatusType('info');

        try {
            const response = await api.post('api/users/login', formData);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setStatus(`Success! Welcome ${data.user.name}`);
            setStatusType('success');
            console.log('Token:', data.token);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect after a short delay to show success message
            setTimeout(() => {
                window.location.href = '/';
            }, 800);
            
        } catch (error) {
            setStatus(error.message);
            setStatusType('error');
            console.error(error);
        }
    }

    return (
        <>

        <NavBar/>
        <div className="login-page-wrapper">
            {/* School Branding Header */}
            <div className="login-header-container">
                <Header title="Administrative Portal" />
            </div>

            <div className="login-card-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h3>Sign In</h3>
                    <p className="login-instruction">Please enter your credentials to access the system.</p>
                    
                    {status && <div className={`status-message ${statusType}`}>{status}</div>}

                    <div className="form-group">
                        <label htmlFor="identifier">Login ID (Mobile or Email)</label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            placeholder="e.g., 01712345678"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Login to Dashboard
                    </button>

                    <div className="form-footer">
                        <a href="/forgot-password" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Login;