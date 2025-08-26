import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Очистка при размонтировании компонента
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="header">
      <div className="container flex-between-center">
        <Link to="/" className="logo header__logo">
          <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="header__logo-img" width="180" height="62" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="header__nav header__nav--desktop">
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

        {/* Mobile Burger Button */}
        <button 
          className={`burger-menu ${isMobileMenuOpen ? 'burger-menu--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.nav
              className="header__nav--mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu__header">
                <div className="mobile-menu__header-content">
                  <Link to="/" className="mobile-menu__logo" onClick={closeMobileMenu}>
                    <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="mobile-menu__logo-img" />
                  </Link>
                </div>
              </div>
              
              <div className="mobile-menu__content">
                <Link 
                  to="/" 
                  className={`mobile-menu__item ${isActive('/') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Вход</span>
                </Link>
                
                <Link 
                  to="/registration" 
                  className={`mobile-menu__item ${isActive('/registration') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M15 8A5 5 0 1 0 5 8a5 5 0 0 0 10 0m2.5 13v-7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 20a7 7 0 0 1 11-5.745" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Регистрация</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
