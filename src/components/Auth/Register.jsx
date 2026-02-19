import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Morphic.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="morphic-container">
            <div className="morphic-card">
                <h1 className="morphic-title">NETFLIX<span>+</span></h1>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>Join the community</p>
                {error && <div className="error-message">{error}</div>}
                <form className="morphic-form" onSubmit={handleSubmit}>
                    <div className="morphic-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="morphic-input"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="morphic-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="morphic-input"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="morphic-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="morphic-input"
                            placeholder="Optional"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="morphic-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="morphic-input"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="morphic-button">Get Started</button>
                </form>
                <div className="morphic-footer">
                    Already have an account? <Link to="/login" className="morphic-link">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
