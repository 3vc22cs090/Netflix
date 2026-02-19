import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [show, handleShow] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            if (window.scrollY > 100) {
                handleShow(true);
            } else {
                handleShow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className={`header ${show && 'header__black'}`}>
            <div className="header__left">
                <img
                    className="header__logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                    alt="Netflix Logo"
                />
                <div className="header__navLinks">
                    <span>Home</span>
                    <span>TV Shows</span>
                    <span>Movies</span>
                    <span>New & Popular</span>
                    <span>My List</span>
                </div>
            </div>

            <div className="header__right">
                <Search className="header__icon" />
                <span className="header__dvd">DVD</span>
                <Bell className="header__icon" />
                <div className="header__user">
                    <User className="header__icon" />
                    <span className="header__userName">{user?.name || 'User'}</span>
                </div>
                <div className="header__logout" onClick={handleLogout} title="Logout">
                    <LogOut className="header__icon" />
                </div>
            </div>
        </div>
    );
};

export default Header;
