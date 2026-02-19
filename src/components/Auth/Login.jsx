import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import '../../styles/Morphic.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="morphic-container">
            <div className="morphic-card">
                <h1 className="morphic-title">NETFLIX<span>+</span></h1>
                {error && <div className="error-message">{error}</div>}
                <form className="morphic-form" onSubmit={handleSubmit}>
                    <div className="morphic-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="morphic-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="morphic-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="morphic-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="morphic-button">Sign In</button>
                </form>
                <div className="morphic-footer">
                    New to Netflix? <Link to="/register" className="morphic-link">Sign up now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
