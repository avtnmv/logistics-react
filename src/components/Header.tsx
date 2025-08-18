import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container flex-between-center">
        <Link to="/" className="logo header__logo">
          <img src="/img/logo.webp" alt="logo" className="header__logo-img" width="180" height="62" />
        </Link>
        <nav className="header__nav">
          <Link 
            to="/" 
            className={`header__nav-button header__nav-button--login ${isActive('/') ? 'header__nav-button--active' : ''}`}
          >
            Вход
          </Link>
          <Link 
            to="/registration" 
            className={`header__nav-button header__nav-button--registration ${isActive('/registration') ? 'header__nav-button--active' : ''}`}
          >
            Регистрация
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
